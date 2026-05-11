-- DOAN3 full UI-driven database schema
-- MySQL 8.x / mysql2 compatible
-- Tách bảng theo đúng các mục đang có trong giao diện Admin + Customer UI.

CREATE DATABASE IF NOT EXISTS doan3_web_dulich
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE doan3_web_dulich;

SET FOREIGN_KEY_CHECKS = 0;

DROP PROCEDURE IF EXISTS ThanhToanDonHang;

DROP TABLE IF EXISTS HoaDonVAT;
DROP TABLE IF EXISTS YeuCauDacBiet;
DROP TABLE IF EXISTS ThongTinDatCho;
DROP TABLE IF EXISTS ThanhToan;
DROP TABLE IF EXISTS DanhGia;
DROP TABLE IF EXISTS ChiTietDon;
DROP TABLE IF EXISTS DonDat;
DROP TABLE IF EXISTS NewsletterSubscription;
DROP TABLE IF EXISTS YeuThich;
DROP TABLE IF EXISTS LichSuTimKiem;
DROP TABLE IF EXISTS VeTauGhe;
DROP TABLE IF EXISTS VeTauKhoang;
DROP TABLE IF EXISTS GiaVe;
DROP TABLE IF EXISTS LoaiVe;
DROP TABLE IF EXISTS VeKhuVuiChoi;
DROP TABLE IF EXISTS VeTauHoa;
DROP TABLE IF EXISTS VeMayBay;
DROP TABLE IF EXISTS VeTienIch;
DROP TABLE IF EXISTS TienIch;
DROP TABLE IF EXISTS Ve;
DROP TABLE IF EXISTS KhachSanFAQ;
DROP TABLE IF EXISTS LoaiPhongTienIch;
DROP TABLE IF EXISTS LoaiPhong;
DROP TABLE IF EXISTS KhachSanTienIch;
DROP TABLE IF EXISTS KhachSan;
DROP TABLE IF EXISTS TourReviewHienThi;
DROP TABLE IF EXISTS TourLichKhoiHanh;
DROP TABLE IF EXISTS LichTrinhTour;
DROP TABLE IF EXISTS TourMucDichVu;
DROP TABLE IF EXISTS GoiDichVu;
DROP TABLE IF EXISTS Tour;
DROP TABLE IF EXISTS DanhMucHoatDong;
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
  vaiTro ENUM('ADMIN','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  gioiTinh ENUM('NAM','NU','KHAC') NULL,
  ngaySinh DATE NULL,
  diaChi VARCHAR(255) NULL,
  thanhPho VARCHAR(120) NULL,
  quocGia VARCHAR(120) DEFAULT 'Việt Nam',
  maBuuDien VARCHAR(20) NULL,
  avatar VARCHAR(1000) NULL,
  diemThanhVien INT NOT NULL DEFAULT 0,
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
  loai ENUM('TOUR','KHACH_SAN','VE','MAY_BAY','TAU_HOA','VUI_CHOI','KHAC') NOT NULL DEFAULT 'KHAC',
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ncc_loai (loai),
  INDEX idx_ncc_status (trangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE KhuyenMai (
  maKhuyenMai INT AUTO_INCREMENT PRIMARY KEY,
  ten VARCHAR(200) NOT NULL,
  maCode VARCHAR(80) UNIQUE,
  moTa TEXT,
  giamGia DECIMAL(12,2) NOT NULL DEFAULT 0,
  loaiGiamGia ENUM('PERCENT','AMOUNT') DEFAULT 'PERCENT',
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
  loaiDichVu ENUM('TOUR','KHACH_SAN','VE') NOT NULL,
  maNhaCungCap INT NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  badge VARCHAR(100) NULL,
  isNoiBat TINYINT(1) NOT NULL DEFAULT 0,
  luotXem INT NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dichvu_nhacungcap FOREIGN KEY (maNhaCungCap)
    REFERENCES NhaCungCap(maNhaCungCap) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_dv_type (loaiDichVu),
  INDEX idx_dv_status (trangThai),
  INDEX idx_dv_supplier (maNhaCungCap),
  FULLTEXT INDEX ft_dv_search (ten, moTa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE HinhAnh (
  maHinhAnh INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NOT NULL,
  urlAnh VARCHAR(1000) NOT NULL,
  altText VARCHAR(255) NULL,
  isAvatar TINYINT(1) NOT NULL DEFAULT 0,
  thuTu INT NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hinhanh_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ha_dv_avatar (maDichVu, isAvatar),
  INDEX idx_ha_order (maDichVu, thuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ACTIVITY / TOUR UI: danh mục, gói, lịch trình, bao gồm/không bao gồm, lịch khởi hành.
CREATE TABLE DanhMucHoatDong (
  maDanhMuc INT AUTO_INCREMENT PRIMARY KEY,
  tenDanhMuc VARCHAR(150) NOT NULL,
  icon VARCHAR(80) NULL,
  gradient VARCHAR(120) NULL,
  moTa TEXT NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  thuTu INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Tour (
  maTour INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NOT NULL UNIQUE,
  maDanhMuc INT NULL,
  tenTour VARCHAR(255) NULL,
  diaDiem VARCHAR(255) NULL,
  viTri VARCHAR(255) NULL,
  viTriKhoiHanh VARCHAR(255) NULL,
  moTaHoatDong TEXT NULL,
  thoiGian VARCHAR(100) NULL,
  giaTour DECIMAL(14,2) NOT NULL DEFAULT 0,
  giaGoc DECIMAL(14,2) NULL,
  giaKhuyenMai DECIMAL(14,2) NULL,
  ngayBatDau DATETIME NULL,
  soLuongKhach INT NOT NULL DEFAULT 0,
  diemDanhGia DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  soLuotDanhGia INT NOT NULL DEFAULT 0,
  highlight VARCHAR(150) NULL,
  isBestSeller TINYINT(1) NOT NULL DEFAULT 0,
  chinhSachHuy VARCHAR(255) NULL,
  xacNhanTucThi TINYINT(1) NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tour_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tour_danhmuc FOREIGN KEY (maDanhMuc)
    REFERENCES DanhMucHoatDong(maDanhMuc) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_tour_location (diaDiem, viTri),
  INDEX idx_tour_price (giaTour),
  INDEX idx_tour_rating (diemDanhGia),
  INDEX idx_tour_category (maDanhMuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE GoiDichVu (
  maGoi INT AUTO_INCREMENT PRIMARY KEY,
  maTour INT NOT NULL,
  tenGoi VARCHAR(150) NOT NULL,
  moTaGoi VARCHAR(255),
  giaGoi DECIMAL(14,2) NOT NULL,
  giaGoc DECIMAL(14,2) NULL,
  soKhachToiThieu INT NOT NULL DEFAULT 1,
  soKhachToiDa INT NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  thuTu INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_goi_tour FOREIGN KEY (maTour)
    REFERENCES Tour(maTour) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_goi_tour (maTour, trangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TourMucDichVu (
  maMuc INT AUTO_INCREMENT PRIMARY KEY,
  maTour INT NOT NULL,
  loaiMuc ENUM('BAO_GOM','KHONG_BAO_GOM','LUU_Y','CHINH_SACH') NOT NULL,
  noiDung VARCHAR(500) NOT NULL,
  thuTu INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_tour_muc_tour FOREIGN KEY (maTour)
    REFERENCES Tour(maTour) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_tour_muc (maTour, loaiMuc, thuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LichTrinhTour (
  maLichTrinh INT AUTO_INCREMENT PRIMARY KEY,
  maTour INT NOT NULL,
  thoiGian VARCHAR(50) NOT NULL,
  tieuDe VARCHAR(255) NOT NULL,
  chiTiet TEXT,
  thuTu INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_lichtrinh_tour FOREIGN KEY (maTour)
    REFERENCES Tour(maTour) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_lichtrinh_order (maTour, thuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TourLichKhoiHanh (
  maLichKhoiHanh INT AUTO_INCREMENT PRIMARY KEY,
  maTour INT NOT NULL,
  ngayKhoiHanh DATE NOT NULL,
  gioKhoiHanh TIME NULL,
  soChoToiDa INT NOT NULL DEFAULT 0,
  soChoConLai INT NOT NULL DEFAULT 0,
  trangThai ENUM('OPEN','FULL','CANCELLED','CLOSED') NOT NULL DEFAULT 'OPEN',
  CONSTRAINT fk_tour_lich_tour FOREIGN KEY (maTour)
    REFERENCES Tour(maTour) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_tour_lich (maTour, ngayKhoiHanh, trangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TourReviewHienThi (
  maReviewHienThi INT AUTO_INCREMENT PRIMARY KEY,
  maTour INT NOT NULL,
  tenKhach VARCHAR(150) NOT NULL,
  avatar VARCHAR(1000) NULL,
  soSao INT NOT NULL DEFAULT 5,
  noiDung TEXT NOT NULL,
  thuTu INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_tour_review_tour FOREIGN KEY (maTour)
    REFERENCES Tour(maTour) ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (soSao BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HOTEL UI: khách sạn, tiện ích, loại phòng, FAQ.
CREATE TABLE KhachSan (
  maKhachSan INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NOT NULL UNIQUE,
  viTri VARCHAR(255),
  tenkhachsan VARCHAR(255),
  diaChiChiTiet VARCHAR(500) NULL,
  soSao INT NOT NULL DEFAULT 5,
  gioCheckIn TIME DEFAULT '14:00:00',
  gioCheckOut TIME DEFAULT '12:00:00',
  chinhSachHuy VARCHAR(255) DEFAULT 'Miễn phí hủy trước 48h',
  lat DECIMAL(10,7) NULL,
  lng DECIMAL(10,7) NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_khachsan_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ks_location (viTri),
  INDEX idx_ks_name (tenkhachsan),
  CHECK (soSao BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TienIch (
  maTienIch INT AUTO_INCREMENT PRIMARY KEY,
  tenTienIch VARCHAR(150) NOT NULL UNIQUE,
  icon VARCHAR(80) NULL,
  loaiTienIch ENUM('KHACH_SAN','PHONG','VE','TOUR') NOT NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE KhachSanTienIch (
  maKhachSan INT NOT NULL,
  maTienIch INT NOT NULL,
  PRIMARY KEY (maKhachSan, maTienIch),
  CONSTRAINT fk_ksti_ks FOREIGN KEY (maKhachSan)
    REFERENCES KhachSan(maKhachSan) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ksti_ti FOREIGN KEY (maTienIch)
    REFERENCES TienIch(maTienIch) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LoaiPhong (
  maLoaiPhong INT AUTO_INCREMENT PRIMARY KEY,
  maKhachSan INT NOT NULL,
  tenLoaiPhong VARCHAR(150) NOT NULL,
  moTa TEXT NULL,
  giaPhong DECIMAL(14,2) NOT NULL DEFAULT 0,
  sucChua INT NOT NULL DEFAULT 1,
  loaiGiuong VARCHAR(120) DEFAULT 'Giường đôi',
  dienTich VARCHAR(50) NULL,
  huongPhong VARCHAR(120) NULL,
  soLuongPhongTrong INT NOT NULL DEFAULT 0,
  anhPhong VARCHAR(1000) NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_loaiphong_khachsan FOREIGN KEY (maKhachSan)
    REFERENCES KhachSan(maKhachSan) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_lp_hotel_price (maKhachSan, giaPhong),
  CHECK (giaPhong >= 0),
  CHECK (sucChua > 0),
  CHECK (soLuongPhongTrong >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LoaiPhongTienIch (
  maLoaiPhong INT NOT NULL,
  maTienIch INT NOT NULL,
  PRIMARY KEY (maLoaiPhong, maTienIch),
  CONSTRAINT fk_lpti_lp FOREIGN KEY (maLoaiPhong)
    REFERENCES LoaiPhong(maLoaiPhong) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_lpti_ti FOREIGN KEY (maTienIch)
    REFERENCES TienIch(maTienIch) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE KhachSanFAQ (
  maFAQ INT AUTO_INCREMENT PRIMARY KEY,
  maKhachSan INT NOT NULL,
  cauHoi VARCHAR(500) NOT NULL,
  cauTraLoi TEXT NOT NULL,
  thuTu INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_faq_ks FOREIGN KEY (maKhachSan)
    REFERENCES KhachSan(maKhachSan) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_faq_order (maKhachSan, thuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- VE UI: máy bay/tàu/khu vui chơi, tiện ích, giá vé, ghế/khoang tàu.
CREATE TABLE Ve (
  maVe INT AUTO_INCREMENT PRIMARY KEY,
  maDichVu INT NULL,
  loaiVeCon ENUM('MAY_BAY','TAU_HOA','VUI_CHOI') NOT NULL,
  trangThai ENUM('AVAILABLE','SOLD_OUT','CANCELLED','INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
  tenHienThi VARCHAR(255) NULL,
  originalPrice DECIMAL(14,2) NULL,
  promo VARCHAR(255) NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ve_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_ve_type (loaiVeCon),
  INDEX idx_ve_status (trangThai),
  INDEX idx_ve_dichvu (maDichVu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeTienIch (
  maVe INT NOT NULL,
  maTienIch INT NOT NULL,
  PRIMARY KEY (maVe, maTienIch),
  CONSTRAINT fk_veti_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_veti_ti FOREIGN KEY (maTienIch)
    REFERENCES TienIch(maTienIch) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeMayBay (
  maVe INT PRIMARY KEY,
  hangHangKhong VARCHAR(150),
  logoHang VARCHAR(1000) NULL,
  soHieuChuyenBay VARCHAR(50),
  hangVe VARCHAR(100) DEFAULT 'Phổ thông',
  goiGia VARCHAR(100) NULL,
  diemKhoiHanh VARCHAR(150) NOT NULL,
  maSanBayDi VARCHAR(10) NULL,
  tenSanBayDi VARCHAR(255) NULL,
  diemDen VARCHAR(150) NOT NULL,
  maSanBayDen VARCHAR(10) NULL,
  tenSanBayDen VARCHAR(255) NULL,
  thoiGianKhoiHanh DATETIME NOT NULL,
  thoiGianDen DATETIME,
  thoiLuongPhut INT NULL,
  soDiemDung INT NOT NULL DEFAULT 0,
  hanhLyXachTay VARCHAR(80) NULL,
  hanhLyKyGui VARCHAR(80) NULL,
  suatAn VARCHAR(120) NULL,
  giaiTri VARCHAR(120) NULL,
  hoanTien TINYINT(1) NOT NULL DEFAULT 0,
  doiNgayBay TINYINT(1) NOT NULL DEFAULT 1,
  dieuKienVe TEXT NULL,
  thuePhiSanBay DECIMAL(14,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_vemaybay_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vmb_search (diemKhoiHanh, diemDen, thoiGianKhoiHanh),
  INDEX idx_vmb_airline (hangHangKhong),
  INDEX idx_vmb_flight_no (soHieuChuyenBay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeTauHoa (
  maVe INT PRIMARY KEY,
  hangTau VARCHAR(150),
  nhaVanHanh VARCHAR(100) NULL,
  soHieuChuyenTau VARCHAR(50),
  diemKhoiHanh VARCHAR(150) NOT NULL,
  gaKhoiHanh VARCHAR(150) NULL,
  diemDen VARCHAR(150) NOT NULL,
  gaDen VARCHAR(150) NULL,
  thoiGianKhoiHanh DATETIME NOT NULL,
  thoiGianDen DATETIME,
  thoiLuongPhut INT NULL,
  loaiChoMacDinh VARCHAR(100) NULL,
  chinhSachHoan VARCHAR(255) DEFAULT 'Hoàn tiền 100% khi hủy trước 24h',
  CONSTRAINT fk_vetauhoa_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vth_search (diemKhoiHanh, diemDen, thoiGianKhoiHanh),
  INDEX idx_vth_train_no (soHieuChuyenTau)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeKhuVuiChoi (
  maVe INT PRIMARY KEY,
  diaDiemSuDung VARCHAR(255) NOT NULL,
  ngayHetHan DATETIME,
  danhMuc VARCHAR(150) NULL,
  highlight VARCHAR(150) NULL,
  xacNhanTucThi TINYINT(1) NOT NULL DEFAULT 1,
  chinhSachHuy VARCHAR(255) NULL,
  CONSTRAINT fk_vekvc_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vkvc_location (diaDiemSuDung),
  INDEX idx_vkvc_category (danhMuc),
  INDEX idx_vkvc_expire (ngayHetHan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LoaiVe (
  maLoaiVe INT AUTO_INCREMENT PRIMARY KEY,
  tenLoaiVe VARCHAR(150) NOT NULL UNIQUE,
  moTa VARCHAR(255) NULL,
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
  giaGoc DECIMAL(14,2) NULL,
  soChoTrong INT NOT NULL DEFAULT 0,
  thuePhi DECIMAL(14,2) NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_giave_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_giave_loaive FOREIGN KEY (maLoaiVe)
    REFERENCES LoaiVe(maLoaiVe) ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_giave_ve_loaive (maVe, maLoaiVe),
  INDEX idx_gv_price (gia),
  CHECK (gia >= 0),
  CHECK (soChoTrong >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeTauKhoang (
  maKhoang INT AUTO_INCREMENT PRIMARY KEY,
  maVe INT NOT NULL,
  tenKhoang VARCHAR(100) NOT NULL,
  toaSo VARCHAR(50) NULL,
  loaiCho VARCHAR(100) NOT NULL,
  thuTu INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_vtk_ve FOREIGN KEY (maVe)
    REFERENCES Ve(maVe) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_vtk_ve (maVe, thuTu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VeTauGhe (
  maGhe INT AUTO_INCREMENT PRIMARY KEY,
  maKhoang INT NOT NULL,
  soGhe VARCHAR(20) NOT NULL,
  trangThai ENUM('AVAILABLE','BOOKED','LOCKED') NOT NULL DEFAULT 'AVAILABLE',
  tang INT NULL,
  giaThem DECIMAL(14,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_vtg_khoang FOREIGN KEY (maKhoang)
    REFERENCES VeTauKhoang(maKhoang) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_vtg_khoang_ghe (maKhoang, soGhe),
  INDEX idx_vtg_status (trangThai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CUSTOMER state/UI extras.
CREATE TABLE NewsletterSubscription (
  maDangKy INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  source VARCHAR(80) NULL,
  trangThai ENUM('ACTIVE','UNSUBSCRIBED') NOT NULL DEFAULT 'ACTIVE',
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_news_email_source (email, source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE YeuThich (
  maUser INT NOT NULL,
  maDichVu INT NOT NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (maUser, maDichVu),
  CONSTRAINT fk_yt_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_yt_dv FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE LichSuTimKiem (
  maTimKiem INT AUTO_INCREMENT PRIMARY KEY,
  maUser INT NULL,
  loaiTimKiem ENUM('HOTEL','FLIGHT','TRAIN','ACTIVITY') NOT NULL,
  tuKhoa VARCHAR(255) NULL,
  diemDi VARCHAR(150) NULL,
  diemDen VARCHAR(150) NULL,
  ngayDi DATE NULL,
  ngayVe DATE NULL,
  soNguoiLon INT NULL,
  soTreEm INT NULL,
  soPhong INT NULL,
  rawParams JSON NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lstk_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_lstk_user (maUser, ngayTao),
  INDEX idx_lstk_type (loaiTimKiem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ORDER / CHECKOUT / PAYMENT UI.
CREATE TABLE DonDat (
  maDon INT AUTO_INCREMENT PRIMARY KEY,
  maUser INT NOT NULL,
  maKhuyenMai INT NULL,
  tongGia DECIMAL(14,2) NOT NULL DEFAULT 0,
  giaGoc DECIMAL(14,2) NOT NULL DEFAULT 0,
  tongTruocThue DECIMAL(14,2) NOT NULL DEFAULT 0,
  thuePhi DECIMAL(14,2) NOT NULL DEFAULT 0,
  tongSauThue DECIMAL(14,2) NOT NULL DEFAULT 0,
  vatRate DECIMAL(5,2) NOT NULL DEFAULT 0,
  trangThai ENUM('PENDING','CONFIRMED','PAID','PARTIAL_PAID','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  loaiDon ENUM('HOTEL','TOUR','FLIGHT','TRAIN','ACTIVITY','MIXED') NOT NULL DEFAULT 'MIXED',
  ghiChu TEXT NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dondat_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_dondat_khuyenmai FOREIGN KEY (maKhuyenMai)
    REFERENCES KhuyenMai(maKhuyenMai) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_dd_user (maUser),
  INDEX idx_dd_status (trangThai),
  INDEX idx_dd_type (loaiDon),
  INDEX idx_dd_created (ngayTao),
  CHECK (tongGia >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ChiTietDon (
  maChiTiet INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL,
  maDichVu INT NOT NULL,
  maPhanLoaiDichVu INT NULL,
  loaiPhanLoai ENUM('LOAI_PHONG','GOI_TOUR','GIA_VE','GHE_TAU','KHAC') NULL,
  soLuong INT NOT NULL DEFAULT 1,
  giaTaiThoiDiemMua DECIMAL(14,2) NOT NULL DEFAULT 0,
  thanhTien DECIMAL(14,2) NOT NULL DEFAULT 0,
  ngayBatDauSuDung DATETIME NULL,
  ngayKetThucSuDung DATETIME NULL,
  soDem INT NULL,
  soNguoiLon INT NULL,
  soTreEm INT NULL,
  tenSnapshot VARCHAR(255) NULL,
  moTaSnapshot TEXT NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ctd_dondat FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ctd_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_ctd_order (maDon),
  INDEX idx_ctd_service (maDichVu),
  CHECK (soLuong > 0),
  CHECK (giaTaiThoiDiemMua >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ThongTinDatCho (
  maThongTin INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL UNIQUE,
  hoTenLienHe VARCHAR(150) NOT NULL,
  emailLienHe VARCHAR(150) NOT NULL,
  sdtLienHe VARCHAR(20) NULL,
  laNguoiSuDung TINYINT(1) NOT NULL DEFAULT 1,
  tenKhachSuDung VARCHAR(150) NULL,
  ghiChuYeuCau TEXT NULL,
  CONSTRAINT fk_ttdc_don FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE YeuCauDacBiet (
  maYeuCau INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL,
  maChiTiet INT NULL,
  loaiYeuCau VARCHAR(120) NOT NULL,
  noiDung VARCHAR(500) NOT NULL,
  trangThai ENUM('REQUESTED','ACCEPTED','REJECTED','DONE') NOT NULL DEFAULT 'REQUESTED',
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ycdb_don FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ycdb_ct FOREIGN KEY (maChiTiet)
    REFERENCES ChiTietDon(maChiTiet) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ycdb_don (maDon)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DanhGia (
  maDanhGia INT AUTO_INCREMENT PRIMARY KEY,
  maUser INT NOT NULL,
  maDichVu INT NOT NULL,
  maDon INT NULL,
  soSao INT NOT NULL,
  binhLuan TEXT,
  ngayDanhGia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dg_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dg_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dg_don FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE KEY uq_dg_user_dichvu (maUser, maDichVu),
  CHECK (soSao BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ThanhToan (
  maThanhToan INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL,
  maUser INT NULL,
  soTien DECIMAL(14,2) NOT NULL DEFAULT 0,
  phuongThuc ENUM('VNPAY','MOMO','COD','BANK_TRANSFER','WALLET') NOT NULL,
  paymentProvider VARCHAR(80) NULL,
  maGiaoDichNgoai VARCHAR(255),
  providerTransactionId VARCHAR(255) NULL,
  redirectUrl VARCHAR(1000) NULL,
  failureReason VARCHAR(500) NULL,
  ghiChu TEXT NULL,
  trangThai ENUM('PENDING','PAID','FAILED','REFUNDED','PARTIAL_REFUND') NOT NULL DEFAULT 'PENDING',
  ngayThanhToan DATETIME NULL,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tt_dondat FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_tt_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_tt_order (maDon),
  INDEX idx_tt_status (trangThai),
  INDEX idx_tt_method (phuongThuc),
  CHECK (soTien > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE HoaDonVAT (
  maHoaDonVAT INT AUTO_INCREMENT PRIMARY KEY,
  maDon INT NOT NULL UNIQUE,
  tenCongTy VARCHAR(255) NULL,
  maSoThue VARCHAR(50) NULL,
  diaChiCongTy VARCHAR(500) NULL,
  emailNhanHoaDon VARCHAR(150) NULL,
  trangThai ENUM('REQUESTED','ISSUED','CANCELLED') NOT NULL DEFAULT 'REQUESTED',
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayXuat DATETIME NULL,
  CONSTRAINT fk_vat_don FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE CASCADE ON UPDATE CASCADE
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

  INSERT INTO ThanhToan (maDon, maUser, soTien, phuongThuc, maGiaoDichNgoai, trangThai, ngayThanhToan)
  VALUES (p_maDon, v_maUser, p_soTien, UPPER(p_phuongThuc), p_maGiaoDichNgoai, 'PAID', NOW());

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

-- Seed cơ bản cho UI filters/cards.
INSERT INTO Users (username, password, ten, email, sdt, vaiTro, trangThai) VALUES
('admin', 'admin123', 'Quản trị viên', 'admin@example.com', '0900000000', 'ADMIN', 1),
('khachhang', 'khach123', 'Khách hàng mẫu', 'customer@example.com', '0911111111', 'CUSTOMER', 1);

INSERT INTO LoaiVe (tenLoaiVe, moTa, trangThai) VALUES
('Phổ thông', 'Hạng phổ thông', 1),
('Thương gia', 'Hạng thương gia', 1),
('VIP', 'Gói VIP', 1),
('Người lớn', 'Vé người lớn', 1),
('Trẻ em', 'Vé trẻ em', 1),
('Giường nằm khoang 4', 'Tàu hỏa giường nằm khoang 4', 1),
('Ngồi mềm', 'Tàu hỏa ghế ngồi mềm', 1);

INSERT INTO DanhMucHoatDong (tenDanhMuc, icon, gradient, thuTu) VALUES
('Công viên giải trí', 'Tent', 'from-blue-500 to-cyan-400', 1),
('Tour du lịch', 'Sparkles', 'from-orange-500 to-pink-500', 2),
('Làm đẹp & Spa', 'Scissors', 'from-purple-500 to-pink-400', 3),
('Workshop', 'Palette', 'from-emerald-400 to-teal-500', 4),
('Thể thao dưới nước', 'Waves', 'from-sky-500 to-blue-500', 5);

INSERT INTO TienIch (tenTienIch, icon, loaiTienIch) VALUES
('Hồ bơi', 'Waves', 'KHACH_SAN'),
('Spa', 'Sparkles', 'KHACH_SAN'),
('Phòng Gym', 'Dumbbell', 'KHACH_SAN'),
('Nhà hàng', 'UtensilsCrossed', 'KHACH_SAN'),
('Wifi miễn phí', 'Wifi', 'PHONG'),
('Nước uống', 'Coffee', 'PHONG'),
('Điều hòa', 'Wind', 'PHONG'),
('Wi-Fi', 'Wifi', 'VE'),
('Bữa ăn', 'Utensils', 'VE'),
('Ổ cắm điện', 'Plug', 'VE');

INSERT INTO NhaCungCap (ten, email, sdt, diaChi, loai, trangThai) VALUES
('Vietnam Airlines', 'contact@vna.example', '19001100', 'Hà Nội', 'MAY_BAY', 1),
('Đường sắt Việt Nam', 'contact@rail.example', '19000109', 'Hà Nội', 'TAU_HOA', 1),
('Sun World', 'contact@sunworld.example', '19001234', 'Đà Nẵng', 'VUI_CHOI', 1),
('Khách sạn Biển Xanh', 'hotel@example.com', '0902222333', 'Đà Nẵng', 'KHACH_SAN', 1),
('Saigon Tourist', 'tour@example.com', '0903333444', 'TP.HCM', 'TOUR', 1);

INSERT INTO KhuyenMai (ten, maCode, giamGia, loaiGiamGia, ngayBatDau, ngayKetThuc, trangThai) VALUES
('Giảm 10% mùa hè', 'SUMMER10', 10, 'PERCENT', '2026-05-01 00:00:00', '2026-08-31 23:59:59', 1),
('Giảm 200K khách mới', 'NEW200K', 200000, 'AMOUNT', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1);
