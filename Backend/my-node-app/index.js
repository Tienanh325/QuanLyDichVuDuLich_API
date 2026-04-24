const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express(); // This line initializes 'app'

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Domain của Frontend
    credentials: true // Cho phép gửi kèm Cookie / Authorization headers
}));
app.use(express.json());

// Routes
app.use("/api", require("./routes/Admin_nhacungcap"));
app.use("/api", require("./routes/Admin_resources"));
app.use("/api/admin", require("./routes/admin.routes")); // Khai báo Admin Dashboard Routes mới
app.use("/api/auth", require("./routes/auth.routes")); // Khai báo Route Auth

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy tại link: http://localhost:${PORT}`);
        connectDB()
            .then(() => {
                console.log("Initial database check succeeded");
            })
            .catch((err) => {
                console.warn(`Database unavailable at startup: ${err.message}`);
            });
    });
};

startServer();
