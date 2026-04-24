const express = require("express");
const controller = require("../controllers/admin");
const { requireAdminAuth } = require("../middleware/adminAuth");

const router = express.Router();

const resources = [
    { path: "/nha-cung-cap", key: "suppliers" },
    { path: "/dich-vu", key: "services" },
    { path: "/tour", key: "tours" },
    { path: "/ve", key: "tickets" },
    { path: "/loai-ve", key: "ticketTypes" },
    { path: "/khach-san", key: "hotels" },
    { path: "/khuyen-mai", key: "promotions" },
    { path: "/nguoi-dung", key: "users" },
    { path: "/tai-khoan", key: "accounts" },
    { path: "/quan-tri-vien", key: "admins" },
    { path: "/don-dat", key: "orders" },
    { path: "/chi-tiet-don", key: "orderDetails" },
    { path: "/thanh-toan", key: "payments" },
    { path: "/danh-gia", key: "reviews" }
];

router.post("/dang-nhap", controller.login);

router.use(requireAdminAuth);

router.get("/dashboard", controller.getDashboard);
router.get("/lookups", controller.getLookups);
router.get("/don-dat/:id/chi-tiet", controller.getOrderBundle);

resources.forEach((resource) => {
    router.get(resource.path, controller.listResource(resource.key));
    router.get(`${resource.path}/:id`, controller.getResourceById(resource.key));
    router.post(resource.path, controller.createResource(resource.key));
    router.put(`${resource.path}/:id`, controller.updateResource(resource.key));
    router.delete(`${resource.path}/:id`, controller.deleteResource(resource.key));
});

module.exports = router;
