-- ============================================================
-- SCRIPT SỬA DỮ LIỆU DATABASE TRAVEL
-- Chạy lệnh này trong MySQL Workbench hoặc HeidiSQL
-- ============================================================

USE travel;

-- ============================================================
-- BƯỚC 1: Kiểm tra dữ liệu hiện tại
-- ============================================================

-- Xem danh sách DichVu hiện có
SELECT maDichVu, ten, loaiDichVu, maNhaCungCap FROM DichVu ORDER BY maDichVu;

-- Xem KhachSan đang reference maDichVu nào
SELECT ks.maKhachSan, ks.maDichVu, ks.viTri, dv.ten AS tenDichVu, dv.loaiDichVu
FROM KhachSan ks
LEFT JOIN DichVu dv ON ks.maDichVu = dv.maDichVu;

-- Xem LoaiPhong hiện có
SELECT * FROM LoaiPhong;

-- ============================================================
-- BƯỚC 2: Đảm bảo có DichVu loại KHACH_SAN
-- ============================================================

-- Kiểm tra xem có DichVu loại KHACH_SAN không
SELECT * FROM DichVu WHERE loaiDichVu = 'KHACH_SAN';

-- Nếu chưa có khách sạn nào, thêm mới:
-- (Bỏ comment nếu cần)
/*
INSERT INTO NhaCungCap (ten, email, sdt, diaChi, loai, trangThai)
SELECT 'Vinpearl Hotels & Resorts', 'contact@vinpearl.com', '18001000', 'Nha Trang, Khánh Hòa', 'Khách sạn', TRUE
WHERE NOT EXISTS (SELECT 1 FROM NhaCungCap WHERE ten = 'Vinpearl Hotels & Resorts');

INSERT INTO DichVu (ten, moTa, loaiDichVu, maNhaCungCap, trangThai)
SELECT 'Vinpearl Resort & Spa Nha Trang', 'Resort 5 sao ven biển Nha Trang, view biển tuyệt đẹp', 'KHACH_SAN',
       (SELECT maNhaCungCap FROM NhaCungCap WHERE ten = 'Vinpearl Hotels & Resorts' LIMIT 1), TRUE
WHERE NOT EXISTS (SELECT 1 FROM DichVu WHERE loaiDichVu = 'KHACH_SAN' AND ten LIKE '%Vinpearl%');
*/

-- ============================================================
-- BƯỚC 3: Fix KhachSan - đảm bảo reference đúng DichVu KHACH_SAN
-- ============================================================

-- Xem KhachSan đang trỏ sai (maDichVu thuộc loại khác KHACH_SAN)
SELECT ks.maKhachSan, ks.maDichVu, dv.ten, dv.loaiDichVu
FROM KhachSan ks
JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
WHERE dv.loaiDichVu != 'KHACH_SAN';

-- Nếu KhachSan trỏ sai DichVu, sửa lại:
-- Ví dụ: nếu KhachSan.maDichVu = 18 (Tour), phải đổi sang maDichVu đúng của KHACH_SAN
-- Chạy từng bước: 
-- 1. Tìm maDichVu đúng của khách sạn
SELECT maDichVu FROM DichVu WHERE loaiDichVu = 'KHACH_SAN' LIMIT 5;

-- 2. Update KhachSan (thay XX bằng maDichVu đúng từ kết quả trên)
-- UPDATE KhachSan SET maDichVu = XX WHERE maKhachSan = 1;

-- ============================================================
-- BƯỚC 4: Thêm dữ liệu mẫu cho KhachSan nếu chưa có
-- ============================================================

-- Nếu DB hoàn toàn fresh (mới), chạy lần lượt:

-- a) Thêm nhà cung cấp nếu chưa có
INSERT IGNORE INTO NhaCungCap (maNhaCungCap, ten, email, sdt, diaChi, loai, trangThai) VALUES
(1, 'Vietnam Airlines', 'contact@vietnamairlines.com', '19001234', 'Hà Nội', 'Hàng không', TRUE),
(2, 'Vietjet Air', 'info@vietjetair.com', '19001886', 'TP.HCM', 'Hàng không', TRUE),
(3, 'Đường sắt Việt Nam', 'info@vietrail.vn', '19001520', 'Hà Nội', 'Tàu hỏa', TRUE),
(4, 'Sun World', 'info@sunworld.vn', '19001800', 'Hạ Long', 'Khu vui chơi', TRUE),
(5, 'Vinpearl', 'contact@vinpearl.com', '18001000', 'Nha Trang', 'Khách sạn', TRUE),
(6, 'Saigontourist', 'info@saigontourist.com', '02838245555', 'TP.HCM', 'Tour', TRUE);

-- b) Thêm DichVu loại KHACH_SAN
INSERT IGNORE INTO DichVu (maDichVu, ten, moTa, loaiDichVu, maNhaCungCap, trangThai) VALUES
(1, 'Vinpearl Resort & Spa Nha Trang', 'Resort 5 sao ven biển Nha Trang với view biển tuyệt đẹp, hồ bơi ngoài trời và spa cao cấp.', 'KHACH_SAN', 5, TRUE),
(2, 'Tour Đà Nẵng 3N2Đ', 'Khám phá Bà Nà Hills, Cầu Vàng, Hội An cùng hướng dẫn viên chuyên nghiệp.', 'TOUR', 6, TRUE),
(3, 'Chuyến bay HN-Đà Nẵng VN123', 'Vé máy bay Vietnam Airlines Hà Nội - Đà Nẵng', 'VE', 1, TRUE);

-- c) Thêm hình ảnh khách sạn
INSERT IGNORE INTO HinhAnh (maDichVu, urlAnh, isAvatar) VALUES
(1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', TRUE),
(1, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', FALSE),
(1, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', FALSE);

-- d) Thêm KhachSan - PHẢI trỏ đúng maDichVu loại KHACH_SAN
INSERT IGNORE INTO KhachSan (maKhachSan, maDichVu, viTri) VALUES
(1, 1, 'Trần Phú, Nha Trang, Khánh Hòa');

-- e) Thêm LoaiPhong
INSERT IGNORE INTO LoaiPhong (maLoaiPhong, maKhachSan, tenLoaiPhong, giaPhong, sucChua, soLuongPhongTrong) VALUES
(1, 1, 'Deluxe Ocean View', 2500000.00, '2 người lớn', 15),
(2, 1, 'Suite Family', 4500000.00, '2 người lớn, 2 trẻ em', 8),
(3, 1, 'Standard Room', 1200000.00, '2 người lớn', 20);

-- ============================================================
-- BƯỚC 5: Thêm admin account mặc định (nếu chưa có)
-- ============================================================

INSERT IGNORE INTO Users (username, password, ten, email, sdt, vaiTro, trangThai) VALUES
('admin', '$2b$10$rOzJqWmMkXw3ZGzJqWmMkuIJCfrmVvtI7YkRgAJqWdWNVZJPdxH4q', 'Quản trị viên', 'admin@travel.vn', '0912345678', 'ADMIN', TRUE);
-- Lưu ý: password hash trên là 'admin123' được bcrypt
-- Nếu backend dùng plain text comparison thì thay bằng: 'admin123'

-- ============================================================
-- BƯỚC 6: Kiểm tra lại sau khi sửa
-- ============================================================

-- Kiểm tra khách sạn và loại phòng
SELECT 
    ks.maKhachSan,
    dv.ten AS tenKhachSan,
    dv.loaiDichVu,
    ks.viTri,
    COUNT(lp.maLoaiPhong) AS soLoaiPhong,
    MIN(lp.giaPhong) AS giaTuKhoang
FROM KhachSan ks
JOIN DichVu dv ON ks.maDichVu = dv.maDichVu
LEFT JOIN LoaiPhong lp ON ks.maKhachSan = lp.maKhachSan
GROUP BY ks.maKhachSan, dv.ten, dv.loaiDichVu, ks.viTri;

-- Kiểm tra Users
SELECT maUser, username, ten, vaiTro, trangThai FROM Users;
