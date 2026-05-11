-- Database schema for DOAN3 travel booking app
-- MySQL 8.x / mysql2 compatible

CREATE DATABASE IF NOT EXISTS doan3_web_dulich
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE doan3_web_dulich;

SET FOREIGN_KEY_CHECKS = 0;

DROP PROCEDURE IF EXISTS ThanhToanDonHang;

DROP TABLE IF EXISTS ThanhToan;
DROP TABLE IF EXISTS DanhGia;
DROP TABLE IF EXISTS ChiTietDon;
DROP TABLE IF EXISTS DonDat;
DROP TABLE IF EXISTS GiaVe;
DROP TABLE IF EXISTS LoaiVe;
DROP TABLE IF EXISTS VeKhuVuiChoi;
DROP TABLE IF EXISTS VeTauHoa;
DROP TABLE IF EXISTS VeMayBay;
DROP TABLE IF EXISTS Ve;
DROP TABLE IF EXISTS LoaiPhong;
DROP TABLE IF EXISTS KhachSan;
DROP TABLE IF EXISTS Tour;
DROP TABLE IF EXISTS HinhAnh;
DROP TABLE IF EXISTS DichVu;
DROP TABLE IF EXISTS KhuyenMai;
DROP TABLE IF EXISTS NhaCungCap;
DROP TABLE IF EXISTS Users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Users (
  maUser INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  ten VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  sdt VARCHAR(20),
  vaiTro ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (vaiTro),
  INDEX idx_users_status (trangThai),
  INDEX idx_users_search (username, ten, email, sdt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE NhaCungCap (
  maNhaCungCap INT AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(200) NOT NULL,
  email VARCHAR(150),
  sdt VARCHAR(20),
  diaChi VARCHAR(255),
  loai ENUM('TOUR', 'KHACH_SAN', 'VE', 'MAY_BAY', 'TAU_HOA', 'VUI_CHOI', 'KHAC') NOT NULL DEFAULT 'KHAC',
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ncc_status (trangThai),
  INDEX idx_ncc_loai (loai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE KhuyenMai (
  maKhuyenMai INT AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(200) NOT NULL,
  giamGia DECIMAL(12,2) NOT NULL DEFAULT 0,
  ngayBatDau DATETIME NOT NULL,
  ngayKetThuc DATETIME NOT NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_km_date (ngayBatDau, ngayKetThuc),
  INDEX idx_km_status (trangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DichVu (
  maDichVu INT AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(255) NOT NULL,
  moTa TEXT,
  loaiDichVu ENUM('TOUR', 'KHACH_SAN', 'VE') NOT NULL,
  maNhaCungCap INT NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dichvu_nhacungcap FOREIGN KEY (maNhaCungCap)
    REFERENCES NhaCungCap(maNhaCungCap)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_dv_type (loaiDichVu),
  INDEX idx_dv_status (trangThai),
  INDEX idx_dv_supplier (maNhaCungCap),
  FULLTEXT INDEX ft_dv_search (ten, moTa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE HinhAnh (
  maHinhAnh INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NOT NULL,
  urlAnh VARCHAR(1000) NOT NULL,
  isAvatar TINYINT(1) NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hinhanh_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ha_dv_avatar (maDichVu, isAvatar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Tour (
  maTour INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NOT NULL UNIQUE,
  viTri VARCHAR(255),
  thoiGian VARCHAR(100),
  giaTour DECIMAL(14,2) NOT NULL DEFAULT 0,
  ngayBatDau DATETIME,
  soLuongKhach INT NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tour_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_tour_location (viTri),
  INDEX idx_tour_date (ngayBatDau),
  INDEX idx_tour_price (giaTour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE KhachSan (
  maKhachSan INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NOT NULL UNIQUE,
  viTri VARCHAR(255),
  tenkhachsan VARCHAR(255),
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_khachsan_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ks_location (viTri),
  INDEX idx_ks_name (tenkhachsan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LoaiPhong (
  maLoaiPhong INT AUTO_INCREMENT PRIMARY KEY,
  maKhachSan INT NOT NULL,
  tenLoaiPhong VARCHAR(150) NOT NULL,
  giaPhong DECIMAL(14,2) NOT NULL DEFAULT 0,
  sucChua INT NOT NULL DEFAULT 1,
  soLuongPhongTrong INT NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_loaiphong_khachsan FOREIGN KEY (maKhachSan)
    REFERENCES KhachSan(maKhachSan)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_lp_hotel_price (maKhachSan, giaPhong),
  CHECK (giaPhong >= 0),
  CHECK (sucChua > 0),
  CHECK (soLuongPhongTrong >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Ve (
  maVe INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NULL,
  loaiVeCon ENUM('MAY_BAY', 'TAU_HOA', 'VUI_CHOI') NOT NULL,
  trangThai ENUM('AVAILABLE', 'SOLD_OUT', 'CANCELLED', 'INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ve_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_ve_type (loaiVeCon),
  INDEX idx_ve_status (trangThai),
  INDEX idx_ve_dichvu (maDichVu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeMayBay (
  maVe INT PRIMARY KEY,
  hangHangKhong VARCHAR(150),
  soHieuChuyenBay VARCHAR(50),
  diemKhoiHanh VARCHAR(150) NOT NULL,
  diemDen VARCHAR(150) NOT NULL,
  thoiGianKhoiHanh DATETIME NOT NULL,
  thoiGianDen DATETIME,
  CONSTRAINT fk_vemaybay_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vmb_search (diemKhoiHanh, diemDen, thoiGianKhoiHanh),
  INDEX idx_vmb_flight_no (soHieuChuyenBay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeTauHoa (
  maVe INT PRIMARY KEY,
  hangTau VARCHAR(150),
  soHieuChuyenTau VARCHAR(50),
  diemKhoiHanh VARCHAR(150) NOT NULL,
  diemDen VARCHAR(150) NOT NULL,
  thoiGianKhoiHanh DATETIME NOT NULL,
  thoiGianDen DATETIME,
  CONSTRAINT fk_vetauhoa_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vth_search (diemKhoiHanh, diemDen, thoiGianKhoiHanh),
  INDEX idx_vth_train_no (soHieuChuyenTau)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeKhuVuiChoi (
  maVe INT PRIMARY KEY,
  diaDiemSuDung VARCHAR(255) NOT NULL,
  ngayHetHan DATETIME,
  CONSTRAINT fk_vekvc_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vkvc_location (diaDiemSuDung),
  INDEX idx_vkvc_expire (ngayHetHan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LoaiVe (
  maLoaiVe INT AUTO_INCREMENT PRIMARY KEY,
  tenLoaiVe VARCHAR(150) NOT NULL UNIQUE,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lv_status (trangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE GiaVe (
  maGiaVe INT AUTO_INCREMENT PRIMARY KEY,
  maVe INT NOT NULL,
  maLoaiVe INT NOT NULL,
  gia DECIMAL(14,2) NOT NULL DEFAULT 0,
  soChoTrong INT NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_giave_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_giave_loaive FOREIGN KEY (maLoaiVe)
    REFERENCES LoaiVe(maLoaiVe)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_giave_ve_loaive (maVe, maLoaiVe),
  INDEX idx_gv_price (gia),
  CHECK (gia >= 0),
  CHECK (soChoTrong >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DonDat (
  maDon INT AUTO_INCREMENT PRIMARY KEY,
  maUser INT NOT NULL,
  maKhuyenMai INT NULL,
  tongGia DECIMAL(14,2) NOT NULL DEFAULT 0,
  trangThai ENUM('PENDING', 'CONFIRMED', 'PAID', 'PARTIAL_PAID', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dondat_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_dondat_khuyenmai FOREIGN KEY (maKhuyenMai)
    REFERENCES KhuyenMai(maKhuyenMai)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_dd_user (maUser),
  INDEX idx_dd_status (trangThai),
  INDEX idx_dd_created (ngayTao),
  CHECK (tongGia >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ChiTietDon (
  maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL,
  maDichVu INT NOT NULL,
  maPhanLoaiDichVu INT NULL,
  soLuong INT NOT NULL DEFAULT 1,
  giaTaiThoiDiemMua DECIMAL(14,2) NOT NULL DEFAULT 0,
  ngayBatDauSuDung DATETIME NULL,
  ngayKetThucSuDung DATETIME NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ctd_dondat FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ctd_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_ctd_order (maDon),
  INDEX idx_ctd_service (maDichVu),
  CHECK (soLuong > 0),
  CHECK (giaTaiThoiDiemMua >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DanhGia (
  maDanhGia INT AUTO_INCREMENT PRIMARY KEY,
  maUser INT NOT NULL,
  maDichVu INT NOT NULL,
  soSao INT NOT NULL,
  binhLuan TEXT,
  ngayDanhGia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dg_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dg_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_dg_user_dichvu (maUser, maDichVu),
  INDEX idx_dg_service (maDichVu),
  INDEX idx_dg_rating (soSao),
  INDEX idx_dg_date (ngayDanhGia),
  CHECK (soSao BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ThanhToan (
  maThanhToan INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL,
  maUser INT NULL,
  soTien DECIMAL(14,2) NOT NULL DEFAULT 0,
  phuongThuc ENUM('VNPAY', 'MOMO', 'COD', 'BANK_TRANSFER', 'WALLET') NOT NULL,
  maGiaoDichNgoai VARCHAR(255),
  trangThai ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL_REFUND') NOT NULL DEFAULT 'PENDING',
  ngayThanhToan DATETIME NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tt_dondat FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tt_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_tt_order (maDon),
  INDEX idx_tt_user (maUser),
  INDEX idx_tt_status (trangThai),
  INDEX idx_tt_method (phuongThuc),
  INDEX idx_tt_date (ngayThanhToan),
  CHECK (soTien > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$

CREATE PROCEDURE ThanhToanDonHang(
  IN p_maDon INT,
  IN p_soTien DECIMAL(14,2),
  IN p_phuongThuc VARCHAR(50),
  IN p_maGiaoDichNgoai VARCHAR(255)
)
BEGIN
  DECLARE v_maUser INT;
  DECLARE v_tongGia DECIMAL(14,2);
  DECLARE v_daThanhToan DECIMAL(14,2);
  DECLARE v_trangThai VARCHAR(30);

  SELECT maUser, tongGia, trangThai
  INTO v_maUser, v_tongGia, v_trangThai
  FROM DonDat
  WHERE maDon = p_maDon
  FOR UPDATE;

  IF v_trangThai = 'CANCELLED' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Don dat da bi huy';
  END IF;

  INSERT INTO ThanhToan (
    maDon,
    maUser,
    soTien,
    phuongThuc,
    maGiaoDichNgoai,
    trangThai,
    ngayThanhToan
  ) VALUES (
    p_maDon,
    v_maUser,
    p_soTien,
    UPPER(p_phuongThuc),
    p_maGiaoDichNgoai,
    'PAID',
    NOW()
  );

  SELECT COALESCE(SUM(soTien), 0)
  INTO v_daThanhToan
  FROM ThanhToan
  WHERE maDon = p_maDon AND trangThai = 'PAID';

  IF v_daThanhToan >= v_tongGia THEN
    UPDATE DonDat SET trangThai = 'PAID' WHERE maDon = p_maDon;
  ELSE
    UPDATE DonDat SET trangThai = 'PARTIAL_PAID' WHERE maDon = p_maDon;
  END IF;
END$$

DELIMITER ;

INSERT INTO Users (username, password, ten, email, sdt, vaiTro, trangThai) VALUES
('admin', 'admin123', 'Quản trị viên', 'admin@example.com', '0900000000', 'ADMIN', 1),
('khachhang', 'khach123', 'Khách hàng mẫu', 'customer@example.com', '0911111111', 'CUSTOMER', 1);

INSERT INTO LoaiVe (tenLoaiVe, trangThai) VALUES
('Phổ thông', 1),
('Thương gia', 1),
('VIP', 1),
('Người lớn', 1),
('Trẻ em', 1);

INSERT INTO NhaCungCap (ten, email, sdt, diaChi, loai, trangThai) VALUES
('Vietnam Airlines', 'contact@vna.example', '19001100', 'Hà Nội', 'MAY_BAY', 1),
('Đường sắt Việt Nam', 'contact@rail.example', '19000109', 'Hà Nội', 'TAU_HOA', 1),
('Sun World', 'contact@sunworld.example', '19001234', 'Đà Nẵng', 'VUI_CHOI', 1),
('Khách sạn Biển Xanh', 'hotel@example.com', '0902222333', 'Đà Nẵng', 'KHACH_SAN', 1),
('Saigon Tourist', 'tour@example.com', '0903333444', 'TP.HCM', 'TOUR', 1);

INSERT INTO KhuyenMai (ten, giamGia, ngayBatDau, ngayKetThuc, trangThai) VALUES
('Giảm 10% mùa hè', 10, '2026-05-01 00:00:00', '2026-08-31 23:59:59', 1),
('Giảm 200K khách mới', 200000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1);
