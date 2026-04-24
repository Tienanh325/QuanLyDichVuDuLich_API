const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../config/db");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "dichvu.json");
const allowFallback = String(process.env.DICHVU_LOCAL_FALLBACK || "false").toLowerCase() === "true";

const defaultServices = [
    {
        maDichVu: 1,
        ten: "Tour Đà Nẵng 3 ngày 2 đêm",
        moTa: "Tham quan các điểm nổi tiếng tại Đà Nẵng",
        loaiDichVu: "TOUR",
        maNhaCungCap: 1,
        trangThai: true
    }
];

let hasLoggedFallback = false;

const logFallback = (err) => {
    if (hasLoggedFallback) return;
    hasLoggedFallback = true;
    console.warn(`Falling back to local service store: ${err.message}`);
};

const normalizeService = (item, fallbackId = 0) => ({
    maDichVu: Number(item?.maDichVu ?? item?.id ?? fallbackId),
    ten: String(item?.ten ?? ""),
    moTa: String(item?.moTa ?? ""),
    loaiDichVu: String(item?.loaiDichVu ?? ""),
    maNhaCungCap: item?.maNhaCungCap != null ? Number(item.maNhaCungCap) : null,
    trangThai: item?.trangThai !== undefined ? Boolean(item.trangThai) : true
});

const ensureStoreExists = async () => {
    await fs.mkdir(dataDir, { recursive: true });
    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, JSON.stringify(defaultServices, null, 2), "utf8");
    }
};

const readStore = async () => {
    await ensureStoreExists();
    const content = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed.map((item, index) => normalizeService(item, index + 1)) : [];
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
    items.reduce((maxId, item) => Math.max(maxId, Number(item.maDichVu) || 0), 0) + 1;

const getAll = async () =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM DichVu");
            return rows;
        },
        async () => readStore()
    );

const getById = async (id) =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM DichVu WHERE maDichVu = ?", [id]);
            return rows[0];
        },
        async () => {
            const items = await readStore();
            return items.find((item) => item.maDichVu === Number(id));
        }
    );

const create = async (data) =>
    withFallback(
        async () => {
            const sqlQuery = `INSERT INTO DichVu (ten, moTa, loaiDichVu, maNhaCungCap, trangThai) VALUES (?, ?, ?, ?, ?)`;
            const values = [data.ten, data.moTa, data.loaiDichVu, data.maNhaCungCap, data.trangThai !== undefined ? data.trangThai : true];

            const [result] = await pool.query(sqlQuery, values);
            return { maDichVu: result.insertId, ...data };
        },
        async () => {
            const items = await readStore();
            const created = normalizeService({ ...data, maDichVu: getNextId(items) }, getNextId(items));
            items.push(created);
            await writeStore(items);
            return created;
        }
    );

const update = async (id, data) =>
    withFallback(
        async () => {
            const sqlQuery = `UPDATE DichVu SET ten = ?, moTa = ?, loaiDichVu = ?, maNhaCungCap = ?, trangThai = ? WHERE maDichVu = ?`;
            const values = [data.ten, data.moTa, data.loaiDichVu, data.maNhaCungCap, data.trangThai, id];

            const [result] = await pool.query(sqlQuery, values);
            if (result.affectedRows === 0) return undefined;
            return { maDichVu: Number(id), ...data };
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maDichVu === Number(id));
            if (index === -1) return undefined;

            const updated = normalizeService({ ...items[index], ...data, maDichVu: items[index].maDichVu }, items[index].maDichVu);
            items[index] = updated;
            await writeStore(items);
            return updated;
        }
    );

const remove = async (id) =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM DichVu WHERE maDichVu = ?", [id]);
            if (rows.length === 0) return undefined;

            await pool.query("DELETE FROM DichVu WHERE maDichVu = ?", [id]);
            return rows[0];
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maDichVu === Number(id));
            if (index === -1) return undefined;

            const [removed] = items.splice(index, 1);
            await writeStore(items);
            return removed;
        }
    );

module.exports = { getAll, getById, create, update, remove };
