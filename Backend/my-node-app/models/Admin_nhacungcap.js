const fs = require("fs/promises");
const path = require("path");
const { sql, connectDB } = require("../config/db");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "nhacungcap.json");

const defaultSuppliers = [
    {
        maNhaCungCap: 1,
        ten: "Cong ty Ve Viet",
        email: "contact@veviet.vn",
        soDienThoai: "0901234567",
        diaChi: "Quan 1, TP.HCM",
        loai: "Ve may bay",
        trangThai: "active"
    },
    {
        maNhaCungCap: 2,
        ten: "Travel Hub",
        email: "sales@travelhub.vn",
        soDienThoai: "0912345678",
        diaChi: "Ha Noi",
        loai: "Tour",
        trangThai: "active"
    },
    {
        maNhaCungCap: 3,
        ten: "Resort Booking",
        email: "hello@resortbooking.vn",
        soDienThoai: "0987654321",
        diaChi: "Da Nang",
        loai: "Khach san",
        trangThai: "inactive"
    }
];

let hasLoggedFallback = false;

const logFallback = (err) => {
    if (hasLoggedFallback) {
        return;
    }

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
        logFallback(err);
        return fallbackAction();
    }
};

const getNextId = (items) =>
    items.reduce((maxId, item) => Math.max(maxId, Number(item.maNhaCungCap) || 0), 0) + 1;

const getAll = async () =>
    withFallback(
        async () => {
            const pool = await connectDB();
            const result = await pool.request().query("SELECT * FROM NhaCungCap");
            return result.recordset;
        },
        async () => readStore()
    );

const getById = async (id) =>
    withFallback(
        async () => {
            const pool = await connectDB();
            const request = pool.request();
            request.input("id", sql.Int, id);

            const result = await request.query(
                "SELECT * FROM NhaCungCap WHERE maNhaCungCap = @id"
            );

            return result.recordset[0];
        },
        async () => {
            const items = await readStore();
            return items.find((item) => item.maNhaCungCap === Number(id));
        }
    );

const create = async (data) =>
    withFallback(
        async () => {
            const pool = await connectDB();
            const request = pool.request();

            request.input("ten", sql.NVarChar, data.ten);
            request.input("email", sql.NVarChar, data.email);
            request.input("soDienThoai", sql.NVarChar, data.soDienThoai);
            request.input("diaChi", sql.NVarChar, data.diaChi);
            request.input("loai", sql.NVarChar, data.loai);
            request.input("trangThai", sql.NVarChar, data.trangThai);

            const result = await request.query(`
                INSERT INTO NhaCungCap (ten, email, soDienThoai, diaChi, loai, trangThai)
                OUTPUT INSERTED.*
                VALUES (@ten, @email, @soDienThoai, @diaChi, @loai, @trangThai)
            `);

            return result.recordset[0];
        },
        async () => {
            const items = await readStore();
            const created = normalizeSupplier(
                {
                    ...data,
                    maNhaCungCap: getNextId(items)
                },
                getNextId(items)
            );
            items.push(created);
            await writeStore(items);
            return created;
        }
    );

const update = async (id, data) =>
    withFallback(
        async () => {
            const pool = await connectDB();
            const request = pool.request();

            request.input("id", sql.Int, id);
            request.input("ten", sql.NVarChar, data.ten);
            request.input("email", sql.NVarChar, data.email);
            request.input("soDienThoai", sql.NVarChar, data.soDienThoai);
            request.input("diaChi", sql.NVarChar, data.diaChi);
            request.input("loai", sql.NVarChar, data.loai);
            request.input("trangThai", sql.NVarChar, data.trangThai);

            const result = await request.query(`
                UPDATE NhaCungCap
                SET ten = @ten,
                    email = @email,
                    soDienThoai = @soDienThoai,
                    diaChi = @diaChi,
                    loai = @loai,
                    trangThai = @trangThai
                OUTPUT INSERTED.*
                WHERE maNhaCungCap = @id
            `);

            return result.recordset[0];
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maNhaCungCap === Number(id));

            if (index === -1) {
                return undefined;
            }

            const updated = normalizeSupplier(
                {
                    ...items[index],
                    ...data,
                    maNhaCungCap: items[index].maNhaCungCap
                },
                items[index].maNhaCungCap
            );
            items[index] = updated;
            await writeStore(items);
            return updated;
        }
    );

const remove = async (id) =>
    withFallback(
        async () => {
            const pool = await connectDB();
            const request = pool.request();
            request.input("id", sql.Int, id);

            const result = await request.query(`
                DELETE FROM NhaCungCap
                OUTPUT DELETED.*
                WHERE maNhaCungCap = @id
            `);

            return result.recordset[0];
        },
        async () => {
            const items = await readStore();
            const index = items.findIndex((item) => item.maNhaCungCap === Number(id));

            if (index === -1) {
                return undefined;
            }

            const [removed] = items.splice(index, 1);
            await writeStore(items);
            return removed;
        }
    );

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
