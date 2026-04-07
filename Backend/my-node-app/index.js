const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express(); // This line initializes 'app'

// Middleware
app.use(cors());
app.use(express.json());

// Your Routes (Moving this below the initialization)
app.use("/api", require("./routes/Admin_nhacungcap"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
};

startServer();
