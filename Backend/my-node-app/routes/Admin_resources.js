const express = require("express");

const router = express.Router();

[
    require("./Admin_dichvu"),
    require("./Admin_tour"),
    require("./Admin_ve"),
    require("./Admin_loaive"),
    require("./Admin_khachsan"),
    require("./Admin_khuyenmai"),
    require("./Admin_nguoidung"),
    require("./Admin_taikhoan"),
    require("./Admin_quantrivien"),
    require("./Admin_dondat"),
    require("./Admin_chitietdon"),
    require("./Admin_thanhtoan"),
    require("./Admin_danhgia")
].forEach((childRouter) => {
    router.use(childRouter);
});

module.exports = router;
