const { sql, connectDB } = require("../config/db");

const getAll = async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM NhaCungCap");
    return result.recordset;
};

const getById = async (id) => {
    const pool = await connectDB();
    const request = pool.request();
    request.input("id", sql.Int, id);

    const result = await request.query(
        "SELECT * FROM NhaCungCap WHERE maNhaCungCap = @id"
    );

    return result.recordset[0];
};

const create = async (data) => {
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
};

const update = async (id, data) => {
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
};

const remove = async (id) => {
    const pool = await connectDB();
    const request = pool.request();
    request.input("id", sql.Int, id);

    const result = await request.query(`
        DELETE FROM NhaCungCap
        OUTPUT DELETED.*
        WHERE maNhaCungCap = @id
    `);

    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
