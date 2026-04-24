const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../config/db");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "tour.json");
const allowFallback = String(process.env.TOUR_LOCAL_FALLBACK || "false").toLowerCase() === "true";

const defaultTours = [
    {
        maTour: 1,
        maDichVu: 1,
        viTri: "Đà Nẵng",
        thoiGian: "3 ngày 2 đêm",
        giaTour: 5000000.00,
        ngayBatDau: "2026-06-01",
        soLuongKhach: 20
    }
];

let hasLoggedFallback = false;

const logFallback = (err) => {
    if (hasLoggedFallback) return;
    hasLoggedFallback = true;
    console.warn(`Falling back to local tour store: ${err.message}`);
};

const normalizeTour = (item, fallbackId = 0) => ({
    maTour: Number(item?.maTour ?? item?.id ?? fallbackId),
    maDichVu: item?.maDichVu != null ? Number(item.maDichVu) : null,
    viTri: String(item?.viTri ?? ""),
    thoiGian: String(item?.thoiGian ?? ""),
    giaTour: item?.giaTour != null ? Number(item.giaTour) : null,
    ngayBatDau: item?.ngayBatDau ? String(item.ngayBatDau) : null,
    soLuongKhach: item?.soLuongKhach != null ? Number(item.soLuongKhach) : null
});

const ensureStoreExists = async () => {
    await fs.mkdir(dataDir, { recursive: true });
    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, JSON.stringify(defaultTours, null, 2), "utf8");
    }
};

const readStore = async () => {
    await ensureStoreExists();
    const content = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed.map((item, index) => normalizeTour(item, index + 1)) : [];
};

const writeStore = async (items) => {
    await ensureStoreExists();
    await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
};

const withFallback = async (dbAction, fallbackAction) => {
    try {
        return await dbAction();
    } catch (err) {
        if (!allowFallback) throw err;
        logFallback(err);
        return fallbackAction();
    }
};

const getNextId = (items) =>
    items.reduce((maxId, item) => Math.max(maxId, Number(item.maTour) || 0), 0) + 1;

const getAll = async () =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM Tour");
            return rows;
        },
        async () => readStore()
    );

const getById = async (id) =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM Tour WHERE maTour = ?", [id]);
            return rows[0];
        },
        async () => {
            const items = await readStore();
            return items.find((item) => item.maTour === Number(id));
        }
    );

const create = async (data) =>
    withFallback(
        async () => {
            const sqlQuery = `INSERT INTO Tour (maDichVu, viTri, thoiGian, giaTour, ngayBatDau, soLuongKhach) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [data.maDichVu, data.viTri, data.thoiGian, data.giaTour, data.ngayBatDau, data.soLuongKhach];

            const [result] = await pool.query(sqlQuery, values);
            return { maTour: result.insertId, ...data };
        },
        async () => {
            const items = await readStore();
            const created = normalizeTour({ ...data, maTour: getNextId(items) }, getNextId(items));
            items.push(created);
            await writeStore(items);
            return created;
        }
    );

const update = async (id, data) =>
    withFallback(
        async () => {
            const sqlQuery = `UPDATE Tour SET maDichVu = ?, viTri = ?, thoiGian = ?, giaTour = ?, ngayBatDau = ?, soLuongKhach = ? WHERE maTour = ?`;
            const values = [data.maDichVu, data.viTri, data.thoiGian, data.giaTour, data.ngayBatDau, data.soLuongKhach, id];

            const [result] = await pool.query(sqlQuery, values);
            if (result.affectedRows === 0) return undefined;
            return { maTour: Number(id), ...data };
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maTour === Number(id));
            if (index === -1) return undefined;

            const updated = normalizeTour({ ...items[index], ...data, maTour: items[index].maTour }, items[index].maTour);
            items[index] = updated;
            await writeStore(items);
            return updated;
        }
    );

const remove = async (id) =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM Tour WHERE maTour = ?", [id]);
            if (rows.length === 0) return undefined;

            await pool.query("DELETE FROM Tour WHERE maTour = ?", [id]);
            return rows[0];
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maTour === Number(id));
            if (index === -1) return undefined;

            const [removed] = items.splice(index, 1);
            await writeStore(items);
            return removed;
        }
    );

module.exports = { getAll, getById, create, update, remove };
