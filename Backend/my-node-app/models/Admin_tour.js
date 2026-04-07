const { sql, connectDB } = require("../config/db");

const getAllTours = async () => {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Tours");
    return result.recordset;
};

const getTourById = async (id) => {
    const pool = await connectDB();
    const result = await pool.request().query(`SELECT * FROM Tours WHERE Id = ${id}`);
    return result.recordset[0];
};

const createTour = async (tour) => {
    const pool = await connectDB();
    const query = `
        INSERT INTO Tours (Name, Price, Description)
        VALUES (N'${tour.name}', ${tour.price}, N'${tour.description}')
    `;
    await pool.request().query(query);
};

const deleteTour = async (id) => {
    const pool = await connectDB();
    await pool.request().query(`DELETE FROM Tours WHERE Id = ${id}`);
};

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    deleteTour
};
