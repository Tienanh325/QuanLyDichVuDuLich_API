const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../config/db"); // Đã bỏ 'sql' vì MySQL không dùng biến này

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "nhacungcap.json");
const allowFallback = String(process.env.SUPPLIER_LOCAL_FALLBACK || "false").toLowerCase() === "true";

const defaultSuppliers = [
    {
        maNhaCungCap: 1,
        ten: "Cong ty Ve Viet",
        email: "contact@veviet.vn",
        soDienThoai: "0901234567",
        diaChi: "Quan 1, TP.HCM",
        loai: "Ve may bay",
        trangThai: "active"
    }
];

let hasLoggedFallback = false;

const logFallback = (err) => {
    if (hasLoggedFallback) return;
    hasLoggedFallback = true;
    console.warn(`Falling back to local supplier store: ${err.message}`);
};

const normalizeSupplier = (item, fallbackId = 0) => ({
    maNhaCungCap: Number(item?.maNhaCungCap ?? item?.id ?? fallbackId),
    ten: String(item?.ten ?? ""),
    email: String(item?.email ?? ""),
    soDienThoai: String(item?.soDienThoai ?? ""),
    diaChi: String(item?.diaChi ?? ""),
    loai: String(item?.loai ?? ""),
    trangThai: String(item?.trangThai ?? "active")
});

const ensureStoreExists = async () => {
    await fs.mkdir(dataDir, { recursive: true });
    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, JSON.stringify(defaultSuppliers, null, 2), "utf8");
    }
};

const readStore = async () => {
    await ensureStoreExists();
    const content = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed.map((item, index) => normalizeSupplier(item, index + 1)) : [];
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
    items.reduce((maxId, item) => Math.max(maxId, Number(item.maNhaCungCap) || 0), 0) + 1;

// ==========================================
// CÁC HÀM ĐÃ ĐƯỢC CHUYỂN ĐỔI SANG MYSQL
// ==========================================

// ==========================================
// CÁC HÀM ĐÃ ĐƯỢC CHUYỂN ĐỔI SANG MYSQL
// ==========================================

const getAll = async () =>
    withFallback(
        async () => {
            // Đã xóa dòng connectDB(), dùng trực tiếp biến pool luôn
            const [rows] = await pool.query("SELECT * FROM NhaCungCap");
            return rows;
        },
        async () => readStore()
    );

const getById = async (id) =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM NhaCungCap WHERE maNhaCungCap = ?", [id]);
            return rows[0];
        },
        async () => {
            const items = await readStore();
            return items.find((item) => item.maNhaCungCap === Number(id));
        }
    );

const create = async (data) =>
    withFallback(
        async () => {
            const sqlQuery = `INSERT INTO NhaCungCap (ten, email, soDienThoai, diaChi, loai, trangThai) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [data.ten, data.email, data.soDienThoai, data.diaChi, data.loai, data.trangThai];
            
            const [result] = await pool.query(sqlQuery, values);
            return { maNhaCungCap: result.insertId, ...data };
        },
        async () => {
            const items = await readStore();
            const created = normalizeSupplier({ ...data, maNhaCungCap: getNextId(items) }, getNextId(items));
            items.push(created);
            await writeStore(items);
            return created;
        }
    );

const update = async (id, data) =>
    withFallback(
        async () => {
            const sqlQuery = `UPDATE NhaCungCap SET ten = ?, email = ?, soDienThoai = ?, diaChi = ?, loai = ?, trangThai = ? WHERE maNhaCungCap = ?`;
            const values = [data.ten, data.email, data.soDienThoai, data.diaChi, data.loai, data.trangThai, id];
            
            const [result] = await pool.query(sqlQuery, values);
            if (result.affectedRows === 0) return undefined;
            return { maNhaCungCap: id, ...data };
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maNhaCungCap === Number(id));
            if (index === -1) return undefined;

            const updated = normalizeSupplier({ ...items[index], ...data, maNhaCungCap: items[index].maNhaCungCap }, items[index].maNhaCungCap);
            items[index] = updated;
            await writeStore(items);
            return updated;
        }
    );

const remove = async (id) =>
    withFallback(
        async () => {
            const [rows] = await pool.query("SELECT * FROM NhaCungCap WHERE maNhaCungCap = ?", [id]);
            if (rows.length === 0) return undefined;

            await pool.query("DELETE FROM NhaCungCap WHERE maNhaCungCap = ?", [id]);
            return rows[0];
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maNhaCungCap === Number(id));
            if (index === -1) return undefined;

            const [removed] = items.splice(index, 1);
            await writeStore(items);
            return removed;
        }
    );

module.exports = { getAll, getById, create, update, remove };