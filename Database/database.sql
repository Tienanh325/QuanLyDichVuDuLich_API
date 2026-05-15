CREATE DATABASE travel;
USE travel;
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
  avatar VARCHAR(1000) NULL,
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

CREATE TABLE NewsletterSubscription (
  maDangKy INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  source VARCHAR(100) NULL,
  trangThai TINYINT(1) NOT NULL DEFAULT 1,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_newsletter_status (trangThai),
  INDEX idx_newsletter_source (source)
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
  urlAnh VARCHAR(1000) NOT NULL,
  altText VARCHAR(255) NULL,
  isAvatar TINYINT(1) NOT NULL DEFAULT 0,
  thuTu INT NOT NULL DEFAULT 0
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
  tieuDe VARCHAR(150) NULL,
  binhLuan TEXT,
  trangThai ENUM('CHO_DUYET','DA_DUYET','TU_CHOI') NOT NULL DEFAULT 'DA_DUYET',
  ngayDanhGia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngayCapNhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dg_user FOREIGN KEY (maUser)
    REFERENCES Users(maUser) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dg_dichvu FOREIGN KEY (maDichVu)
    REFERENCES DichVu(maDichVu) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dg_don FOREIGN KEY (maDon)
    REFERENCES DonDat(maDon) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE KEY uq_dg_user_dichvu (maUser, maDichVu),
  INDEX idx_dg_dichvu_status (maDichVu, trangThai),
  CHECK (soSao BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE TieuChiDanhGia (
  maTieuChi INT AUTO_INCREMENT PRIMARY KEY,
  loaiDichVu ENUM('KHACH_SAN','MAY_BAY','TAU','TOUR') NOT NULL,
  tenTieuChi VARCHAR(100) NOT NULL,
  moTa VARCHAR(255) NULL,
  thuTu INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_tcdg_loai_ten (loaiDichVu, tenTieuChi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ChiTietDanhGia (
  maDanhGia INT NOT NULL,
  maTieuChi INT NOT NULL,
  diem INT NOT NULL,
  PRIMARY KEY (maDanhGia, maTieuChi),
  CONSTRAINT fk_ctdg_danhgia FOREIGN KEY (maDanhGia)
    REFERENCES DanhGia(maDanhGia) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ctdg_tieuchi FOREIGN KEY (maTieuChi)
    REFERENCES TieuChiDanhGia(maTieuChi) ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK (diem BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE AnhDanhGia (
  maAnh INT AUTO_INCREMENT PRIMARY KEY,
  maDanhGia INT NOT NULL,
  urlAnh VARCHAR(500) NOT NULL,
  thuTu INT NOT NULL DEFAULT 0,
  ngayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_adg_danhgia FOREIGN KEY (maDanhGia)
    REFERENCES DanhGia(maDanhGia) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_adg_danhgia (maDanhGia)
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
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE HoaDonVAT;
TRUNCATE TABLE ThanhToan;
TRUNCATE TABLE AnhDanhGia;
TRUNCATE TABLE ChiTietDanhGia;
TRUNCATE TABLE DanhGia;
TRUNCATE TABLE TieuChiDanhGia;
TRUNCATE TABLE YeuCauDacBiet;
TRUNCATE TABLE ThongTinDatCho;
TRUNCATE TABLE ChiTietDon;
TRUNCATE TABLE DonDat;
TRUNCATE TABLE VeTauGhe;
TRUNCATE TABLE VeTauKhoang;
TRUNCATE TABLE GiaVe;
TRUNCATE TABLE LoaiVe;
TRUNCATE TABLE VeTauHoa;
TRUNCATE TABLE VeMayBay;
TRUNCATE TABLE VeTienIch;
TRUNCATE TABLE Ve;
TRUNCATE TABLE KhachSanFAQ;
TRUNCATE TABLE LoaiPhongTienIch;
TRUNCATE TABLE LoaiPhong;
TRUNCATE TABLE KhachSanTienIch;
TRUNCATE TABLE TienIch;
TRUNCATE TABLE KhachSan;
TRUNCATE TABLE TourReviewHienThi;
TRUNCATE TABLE TourLichKhoiHanh;
TRUNCATE TABLE LichTrinhTour;
TRUNCATE TABLE TourMucDichVu;
TRUNCATE TABLE GoiDichVu;
TRUNCATE TABLE Tour;
TRUNCATE TABLE DanhMucHoatDong;
TRUNCATE TABLE HinhAnh;
TRUNCATE TABLE DichVu;
TRUNCATE TABLE KhuyenMai;
TRUNCATE TABLE NhaCungCap;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Users (username, password, ten, email, sdt, vaiTro, trangThai, gioiTinh, ngaySinh, diaChi, thanhPho, quocGia, avatar) VALUES
('admin01', '123456', 'Nguyễn Quản Trị', 'admin01@example.com', '0901000001', 'ADMIN', 1, 'NAM', '1990-01-10', '1 Lê Lợi', 'Hà Nội', 'Việt Nam', 'https://example.com/avatar/admin01.jpg'),
('khach01', '123456', 'Trần Minh Anh', 'khach01@example.com', '0901000002', 'CUSTOMER', 1, 'NU', '1998-03-12', '12 Nguyễn Huệ', 'TP.HCM', 'Việt Nam', 'https://example.com/avatar/khach01.jpg'),
('khach02', '123456', 'Lê Hoàng Nam', 'khach02@example.com', '0901000003', 'CUSTOMER', 1, 'NAM', '1995-05-20', '25 Trần Phú', 'Đà Nẵng', 'Việt Nam', 'https://example.com/avatar/khach02.jpg'),
('khach03', '123456', 'Phạm Thu Hà', 'khach03@example.com', '0901000004', 'CUSTOMER', 1, 'NU', '1997-07-08', '8 Hùng Vương', 'Nha Trang', 'Việt Nam', 'https://example.com/avatar/khach03.jpg'),
('khach04', '123456', 'Vũ Đức Tài', 'khach04@example.com', '0901000005', 'CUSTOMER', 1, 'NAM', '1994-09-15', '30 Bạch Đằng', 'Hải Phòng', 'Việt Nam', 'https://example.com/avatar/khach04.jpg'),
('khach05', '123456', 'Đỗ Ngọc Linh', 'khach05@example.com', '0901000006', 'CUSTOMER', 1, 'NU', '1999-11-22', '18 Lý Thường Kiệt', 'Huế', 'Việt Nam', 'https://example.com/avatar/khach05.jpg'),
('khach06', '123456', 'Bùi Quốc Huy', 'khach06@example.com', '0901000007', 'CUSTOMER', 1, 'NAM', '1993-02-17', '44 Điện Biên Phủ', 'Cần Thơ', 'Việt Nam', 'https://example.com/avatar/khach06.jpg'),
('khach07', '123456', 'Hoàng Mai Chi', 'khach07@example.com', '0901000008', 'CUSTOMER', 1, 'NU', '2000-04-25', '9 Nguyễn Trãi', 'Đà Lạt', 'Việt Nam', 'https://example.com/avatar/khach07.jpg'),
('khach08', '123456', 'Ngô Gia Bảo', 'khach08@example.com', '0901000009', 'CUSTOMER', 1, 'NAM', '1996-06-30', '60 Phan Chu Trinh', 'Quảng Ninh', 'Việt Nam', 'https://example.com/avatar/khach08.jpg'),
('khach09', '123456', 'Đặng Yến Nhi', 'khach09@example.com', '0901000010', 'CUSTOMER', 1, 'NU', '2001-08-19', '75 Nguyễn Du', 'Phú Quốc', 'Việt Nam', 'https://example.com/avatar/khach09.jpg');

INSERT INTO NhaCungCap (ten, email, sdt, diaChi, loai, trangThai) VALUES
('Vietnam Airlines', 'contact@vna.example.com', '19001101', 'Hà Nội', 'MAY_BAY', 1),
('Vietjet Air', 'support@vietjet.example.com', '19001886', 'TP.HCM', 'MAY_BAY', 1),
('Bamboo Airways', 'hello@bamboo.example.com', '19001166', 'Hà Nội', 'MAY_BAY', 1),
('Đường sắt Việt Nam', 'info@vr.example.com', '19006469', 'Hà Nội', 'TAU_HOA', 1),
('Sun World', 'info@sunworld.example.com', '19001234', 'Đà Nẵng', 'VUI_CHOI', 1),
('Vinpearl Hotels', 'hotel@vinpearl.example.com', '19005656', 'Nha Trang', 'KHACH_SAN', 1),
('Saigontourist', 'tour@saigontourist.example.com', '19001808', 'TP.HCM', 'TOUR', 1),
('Vietravel', 'tour@vietravel.example.com', '19001839', 'TP.HCM', 'TOUR', 1),
('Luxury Stay', 'booking@luxury.example.com', '19009999', 'Đà Nẵng', 'KHACH_SAN', 1),
('Local Travel Partner', 'partner@local.example.com', '19002222', 'Hạ Long', 'KHAC', 1);

INSERT INTO KhuyenMai (ten, maCode, moTa, giamGia, loaiGiamGia, ngayBatDau, ngayKetThuc, trangThai) VALUES
('Giảm 10% mùa hè', 'SUMMER10', 'Áp dụng toàn hệ thống', 10, 'PERCENT', '2026-05-01 00:00:00', '2026-08-31 23:59:59', 1),
('Giảm 200K khách sạn', 'HOTEL200', 'Giảm trực tiếp 200000đ', 200000, 'AMOUNT', '2026-05-01 00:00:00', '2026-06-30 23:59:59', 1),
('Tour tiết kiệm', 'TOUR15', 'Giảm 15% tour', 15, 'PERCENT', '2026-05-01 00:00:00', '2026-09-30 23:59:59', 1),
('Bay cuối tuần', 'FLY100', 'Giảm 100000đ vé máy bay', 100000, 'AMOUNT', '2026-05-01 00:00:00', '2026-12-31 23:59:59', 1),
('Tàu hỏa vui vẻ', 'TRAIN8', 'Giảm 8% vé tàu', 8, 'PERCENT', '2026-05-01 00:00:00', '2026-10-31 23:59:59', 1),
('Combo gia đình', 'FAMILY12', 'Giảm 12% đơn gia đình', 12, 'PERCENT', '2026-05-01 00:00:00', '2026-12-31 23:59:59', 1),
('Giảm 50K', 'SAVE50', 'Giảm trực tiếp 50000đ', 50000, 'AMOUNT', '2026-05-01 00:00:00', '2026-07-31 23:59:59', 1),
('Khách mới', 'NEWUSER20', 'Giảm 20% khách mới', 20, 'PERCENT', '2026-05-01 00:00:00', '2026-12-31 23:59:59', 1),
('Du lịch biển', 'BEACH10', 'Giảm 10% dịch vụ biển', 10, 'PERCENT', '2026-05-01 00:00:00', '2026-08-31 23:59:59', 1),
('Ưu đãi VIP', 'VIP500', 'Giảm 500000đ đơn lớn', 500000, 'AMOUNT', '2026-05-01 00:00:00', '2026-12-31 23:59:59', 1);

INSERT INTO DichVu (ten, moTa, loaiDichVu, maNhaCungCap, trangThai, badge, isNoiBat, luotXem) VALUES
('Tour Đà Nẵng 3N2Đ', 'Tour du lịch Đà Nẵng hấp dẫn', 'TOUR', 7, 1, 'HOT', 1, 5000),
('Tour Phú Quốc 4N3Đ', 'Khám phá đảo ngọc Phú Quốc', 'TOUR', 8, 1, 'NEW', 1, 4200),
('Tour Hạ Long 2N1Đ', 'Du thuyền vịnh Hạ Long', 'TOUR', 10, 1, 'BEST', 1, 6100),
('Tour Nha Trang 3N2Đ', 'Biển xanh cát trắng Nha Trang', 'TOUR', 7, 1, 'SALE', 1, 5300),
('Tour Đà Lạt 3N2Đ', 'Thành phố ngàn hoa', 'TOUR', 8, 1, 'HOT', 1, 4800),
('Khách sạn Vinpearl Nha Trang', 'Khách sạn 5 sao ven biển', 'KHACH_SAN', 6, 1, 'BEST', 1, 10000),
('Khách sạn Luxury Đà Nẵng', 'Resort view biển Mỹ Khê', 'KHACH_SAN', 9, 1, 'HOT', 1, 7800),
('Vé máy bay Hà Nội - TP.HCM', 'Bay nhanh giá tốt', 'VE', 1, 1, 'SALE', 1, 7000),
('Vé tàu Hà Nội - Đà Nẵng', 'Tàu chất lượng cao', 'VE', 4, 1, 'NEW', 0, 3600),
('Vé Sun World Bà Nà Hills', 'Vé vui chơi trọn ngày', 'VE', 5, 1, 'HOT', 1, 8200),
('Tour Đà Nẵng 3N2Đ', 'Tour du lịch Đà Nẵng hấp dẫn', 'TOUR', 7, 1, 'HOT', 1, 5000),
('Tour Phú Quốc 4N3Đ', 'Khám phá đảo ngọc Phú Quốc', 'TOUR', 8, 1, 'NEW', 1, 4200),
('Tour Hạ Long 2N1Đ', 'Du thuyền vịnh Hạ Long', 'TOUR', 10, 1, 'BEST', 1, 6100),
('Tour Nha Trang 3N2Đ', 'Biển xanh cát trắng Nha Trang', 'TOUR', 7, 1, 'SALE', 1, 5300),
('Tour Đà Lạt 3N2Đ', 'Thành phố ngàn hoa', 'TOUR', 8, 1, 'HOT', 1, 4800),
('Khách sạn Vinpearl Nha Trang', 'Khách sạn 5 sao ven biển', 'KHACH_SAN', 6, 1, 'BEST', 1, 10000),
('Khách sạn Luxury Đà Nẵng', 'Resort view biển Mỹ Khê', 'KHACH_SAN', 9, 1, 'HOT', 1, 7800),
('Vé máy bay Hà Nội - TP.HCM', 'Bay nhanh giá tốt', 'VE', 1, 1, 'SALE', 1, 7000),
('Vé tàu Hà Nội - Đà Nẵng', 'Tàu chất lượng cao', 'VE', 4, 1, 'NEW', 0, 3600),
('Vé Sun World Bà Nà Hills', 'Vé vui chơi trọn ngày', 'VE', 5, 1, 'HOT', 1, 8200),
('Khách sạn Luxury Đà Nẵng', 'Tour du lịch Đà Nẵng hấp dẫn', 'TOUR', 7, 1, 'HOT', 1, 5000),
('Khách sạn Luxury Đà Nẵng', 'Khám phá đảo ngọc Phú Quốc', 'TOUR', 8, 1, 'NEW', 1, 4200),
('Khách sạn Luxury Đà Nẵng', 'Du thuyền vịnh Hạ Long', 'TOUR', 10, 1, 'BEST', 1, 6100),
('Khách sạn Luxury Đà Nẵng', 'Biển xanh cát trắng Nha Trang', 'TOUR', 7, 1, 'SALE', 1, 5300),
('Khách sạn Luxury Đà Nẵng', 'Thành phố ngàn hoa', 'TOUR', 8, 1, 'HOT', 1, 4800),
('Khách sạn Vinpearl Nha Trang', 'Khách sạn 5 sao ven biển', 'KHACH_SAN', 6, 1, 'BEST', 1, 10000),
('Vé máy bay Hà Nội - TP.HCM', 'Resort view biển Mỹ Khê', 'KHACH_SAN', 9, 1, 'HOT', 1, 7800),
('Vé máy bay Hà Nội - TP.HCM', 'Bay nhanh giá tốt', 'VE', 1, 1, 'SALE', 1, 7000),
('Vé tàu Hà Nội - Đà Nẵng', 'Tàu chất lượng cao', 'VE', 4, 1, 'NEW', 0, 3600),
('Vé Sun World Bà Nà Hills', 'Vé vui chơi trọn ngày', 'VE', 5, 1, 'HOT', 1, 8200);


INSERT INTO HinhAnh (urlAnh, altText, isAvatar, thuTu) VALUES
('https://ik.imagekit.io/tvlk/blog/2022/02/dia-diem-du-lich-viet-nam-cover.jpeg', 'Tour Đà Nẵng', 1, 1),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPWhZeMcqy7_AtFsL_kx_L3t6-zB9k_cxK8Q&s', 'Tour Phú Quốc', 1, 1),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvFnQ6H6JJcRsXUhEswTiRypxjaqHg_0unxw&s', 'Tour Hạ Long', 1, 1),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiTBDGsqHWp4uEHQLmTs2_BX0T8BZ3OW6DRQ&s', 'Tour Nha Trang', 1, 1),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduzb_h54kmQkyZdiNNSIyulXMH_wUneaP-Q&s', 'Bà Nà Hills', 1, 1),
('/uploads/1778651540939-611884122.png', 'Null', 0, 1),
('https://th.bing.com/th/id/OIP.zhvg3_RvL_nm60HNFk12ZAHaE7?w=242&h=180&c=7&r=0&o=7&pid=1.7&rm=3', 'Null', 0, 0);

INSERT INTO DanhMucHoatDong (tenDanhMuc, icon, gradient, moTa, trangThai, thuTu) VALUES
('Biển đảo', 'beach', 'blue-cyan', 'Tour biển đảo', 1, 1),
('Núi rừng', 'mountain', 'green-lime', 'Tour thiên nhiên', 1, 2),
('Thành phố', 'city', 'purple-pink', 'Khám phá đô thị', 1, 3),
('Ẩm thực', 'food', 'orange-red', 'Trải nghiệm ẩm thực', 1, 4),
('Văn hóa', 'museum', 'yellow-orange', 'Di sản văn hóa', 1, 5),
('Mạo hiểm', 'adventure', 'red-black', 'Hoạt động mạo hiểm', 1, 6),
('Nghỉ dưỡng', 'resort', 'teal-blue', 'Du lịch nghỉ dưỡng', 1, 7),
('Gia đình', 'family', 'pink-purple', 'Tour gia đình', 1, 8),
('Tâm linh', 'temple', 'gold-brown', 'Du lịch tâm linh', 1, 9),
('Sinh thái', 'leaf', 'green-teal', 'Du lịch sinh thái', 1, 10);

INSERT INTO Tour (maDichVu, maDanhMuc, tenTour, diaDiem, viTri, viTriKhoiHanh, moTaHoatDong, thoiGian, giaTour, giaGoc, giaKhuyenMai, ngayBatDau, soLuongKhach, diemDanhGia, soLuotDanhGia, highlight, isBestSeller, chinhSachHuy, xacNhanTucThi) VALUES
(1, 3, 'Tour Đà Nẵng 3N2Đ', 'Đà Nẵng', 'Miền Trung', 'Hà Nội', 'Khám phá Đà Nẵng Hội An', '3 ngày 2 đêm', 3500000, 4200000, 3200000, '2026-06-01 08:00:00', 30, 4.8, 120, 'Cầu Vàng', 1, 'Miễn phí hủy trước 7 ngày', 1),
(2, 1, 'Tour Phú Quốc 4N3Đ', 'Phú Quốc', 'Kiên Giang', 'TP.HCM', 'Biển đảo Phú Quốc', '4 ngày 3 đêm', 5200000, 5900000, 4800000, '2026-06-05 07:00:00', 25, 4.7, 98, 'Đảo ngọc', 1, 'Miễn phí hủy trước 7 ngày', 1),
(3, 1, 'Tour Hạ Long 2N1Đ', 'Hạ Long', 'Quảng Ninh', 'Hà Nội', 'Du thuyền vịnh Hạ Long', '2 ngày 1 đêm', 2800000, 3300000, 2500000, '2026-06-10 08:00:00', 35, 4.6, 86, 'Du thuyền', 1, 'Miễn phí hủy trước 5 ngày', 1),
(4, 1, 'Tour Nha Trang 3N2Đ', 'Nha Trang', 'Khánh Hòa', 'TP.HCM', 'Biển Nha Trang', '3 ngày 2 đêm', 3900000, 4500000, 3600000, '2026-06-12 07:30:00', 28, 4.5, 75, 'VinWonders', 0, 'Miễn phí hủy trước 5 ngày', 1),
(5, 2, 'Tour Đà Lạt 3N2Đ', 'Đà Lạt', 'Lâm Đồng', 'TP.HCM', 'Thành phố ngàn hoa', '3 ngày 2 đêm', 3100000, 3700000, 2900000, '2026-06-15 06:30:00', 32, 4.7, 110, 'Săn mây', 1, 'Miễn phí hủy trước 5 ngày', 1),
(11, 4, 'Tour Ẩm thực Đà Nẵng', 'Đà Nẵng', 'Miền Trung', 'Đà Nẵng', 'Ăn đặc sản địa phương', '1 ngày', 950000, 1200000, 850000, '2026-06-20 09:00:00', 15, 4.4, 40, 'Ẩm thực', 0, 'Không hoàn hủy trong 24h', 1),
(12, 7, 'Resort Phú Quốc nghỉ dưỡng', 'Phú Quốc', 'Kiên Giang', 'Hà Nội', 'Nghỉ dưỡng cao cấp', '5 ngày 4 đêm', 7900000, 8900000, 7200000, '2026-06-25 07:00:00', 20, 4.9, 65, 'Resort 5 sao', 1, 'Miễn phí hủy trước 10 ngày', 1),
(13, 8, 'Hạ Long gia đình', 'Hạ Long', 'Quảng Ninh', 'Hà Nội', 'Lịch trình nhẹ nhàng', '2 ngày 1 đêm', 2500000, 3000000, 2300000, '2026-07-01 08:00:00', 40, 4.5, 55, 'Phù hợp trẻ em', 0, 'Miễn phí hủy trước 5 ngày', 1),
(14, 6, 'Lặn biển Nha Trang', 'Nha Trang', 'Khánh Hòa', 'Nha Trang', 'Lặn ngắm san hô', '1 ngày', 1500000, 1800000, 1350000, '2026-07-05 08:30:00', 12, 4.6, 44, 'San hô', 0, 'Không hoàn hủy trong 24h', 1),
(15, 10, 'Sinh thái Đà Lạt', 'Đà Lạt', 'Lâm Đồng', 'Đà Lạt', 'Rừng thông và nông trại', '2 ngày 1 đêm', 2200000, 2600000, 2000000, '2026-07-10 07:30:00', 18, 4.5, 38, 'Nông trại', 0, 'Miễn phí hủy trước 3 ngày', 1);

INSERT INTO GoiDichVu (maTour, tenGoi, moTaGoi, giaGoi, giaGoc, soKhachToiThieu, soKhachToiDa, trangThai, thuTu) VALUES
(1, 'Tiêu chuẩn', 'Khách sạn 3 sao', 3500000, 4200000, 1, 30, 1, 1),
(2, 'Cao cấp', 'Resort 4 sao', 5200000, 5900000, 1, 25, 1, 1),
(3, 'Du thuyền', 'Ngủ đêm du thuyền', 2800000, 3300000, 1, 35, 1, 1),
(4, 'Biển đảo', 'Khách sạn gần biển', 3900000, 4500000, 1, 28, 1, 1),
(5, 'Săn mây', 'Homestay trung tâm', 3100000, 3700000, 1, 32, 1, 1),
(6, 'Food tour', 'Ăn uống trọn gói', 950000, 1200000, 1, 15, 1, 1),
(7, 'Luxury', 'Resort 5 sao', 7900000, 8900000, 2, 20, 1, 1),
(8, 'Gia đình', 'Phòng gia đình', 2500000, 3000000, 2, 40, 1, 1),
(9, 'Lặn biển', 'Kèm dụng cụ lặn', 1500000, 1800000, 1, 12, 1, 1),
(10, 'Sinh thái', 'Ăn trưa nông trại', 2200000, 2600000, 1, 18, 1, 1);

INSERT INTO TourMucDichVu (maTour, loaiMuc, noiDung, thuTu) VALUES
(1, 'BAO_GOM', 'Xe đưa đón, khách sạn, vé tham quan', 1),
(2, 'BAO_GOM', 'Vé máy bay, resort, ăn sáng', 1),
(3, 'BAO_GOM', 'Du thuyền, bữa ăn, vé thắng cảnh', 1),
(4, 'BAO_GOM', 'Khách sạn, xe, hướng dẫn viên', 1),
(5, 'BAO_GOM', 'Xe giường nằm, homestay, ăn sáng', 1),
(6, 'KHONG_BAO_GOM', 'Chi phí cá nhân ngoài chương trình', 2),
(7, 'LUU_Y', 'Mang giấy tờ tùy thân khi nhận phòng', 3),
(8, 'CHINH_SACH', 'Trẻ em dưới 5 tuổi miễn phí', 4),
(9, 'LUU_Y', 'Không phù hợp người có bệnh tim', 3),
(10, 'KHONG_BAO_GOM', 'Thuế VAT nếu yêu cầu hóa đơn', 2);

INSERT INTO LichTrinhTour (maTour, thoiGian, tieuDe, chiTiet, thuTu) VALUES
(1, '08:00', 'Khởi hành', 'Đón khách tại điểm hẹn', 1),
(2, '07:00', 'Bay đến Phú Quốc', 'Làm thủ tục bay', 1),
(3, '09:00', 'Lên du thuyền', 'Tham quan vịnh Hạ Long', 1),
(4, '08:30', 'City tour', 'Tham quan Nha Trang', 1),
(5, '06:30', 'Đi Đà Lạt', 'Khởi hành từ TP.HCM', 1),
(6, '09:00', 'Chợ Cồn', 'Thưởng thức món địa phương', 1),
(7, '14:00', 'Nhận phòng resort', 'Nghỉ ngơi tự do', 1),
(8, '10:00', 'Hang Sửng Sốt', 'Tham quan hang động', 1),
(9, '08:00', 'Ra đảo', 'Lặn ngắm san hô', 1),
(10, '07:30', 'Nông trại', 'Tham quan vườn rau', 1);

INSERT INTO TourLichKhoiHanh (maTour, ngayKhoiHanh, gioKhoiHanh, soChoToiDa, soChoConLai, trangThai) VALUES
(1, '2026-06-01', '08:00:00', 30, 20, 'OPEN'),
(2, '2026-06-05', '07:00:00', 25, 18, 'OPEN'),
(3, '2026-06-10', '08:00:00', 35, 22, 'OPEN'),
(4, '2026-06-12', '07:30:00', 28, 15, 'OPEN'),
(5, '2026-06-15', '06:30:00', 32, 24, 'OPEN'),
(6, '2026-06-20', '09:00:00', 15, 10, 'OPEN'),
(7, '2026-06-25', '07:00:00', 20, 12, 'OPEN'),
(8, '2026-07-01', '08:00:00', 40, 30, 'OPEN'),
(9, '2026-07-05', '08:30:00', 12, 6, 'OPEN'),
(10, '2026-07-10', '07:30:00', 18, 11, 'OPEN');

INSERT INTO TourReviewHienThi (maTour, tenKhach, avatar, soSao, noiDung, thuTu) VALUES
(1, 'Minh Anh', 'https://example.com/avatar/r1.jpg', 5, 'Tour rất vui, hướng dẫn viên nhiệt tình', 1),
(2, 'Hoàng Nam', 'https://example.com/avatar/r2.jpg', 5, 'Biển đẹp, resort tốt', 1),
(3, 'Thu Hà', 'https://example.com/avatar/r3.jpg', 4, 'Du thuyền sạch đẹp', 1),
(4, 'Đức Tài', 'https://example.com/avatar/r4.jpg', 4, 'Lịch trình hợp lý', 1),
(5, 'Ngọc Linh', 'https://example.com/avatar/r5.jpg', 5, 'Đà Lạt rất đáng đi', 1),
(6, 'Quốc Huy', 'https://example.com/avatar/r6.jpg', 4, 'Đồ ăn ngon', 1),
(7, 'Mai Chi', 'https://example.com/avatar/r7.jpg', 5, 'Dịch vụ cao cấp', 1),
(8, 'Gia Bảo', 'https://example.com/avatar/r8.jpg', 4, 'Phù hợp gia đình', 1),
(9, 'Yến Nhi', 'https://example.com/avatar/r9.jpg', 5, 'Lặn biển tuyệt vời', 1),
(10, 'Anh Khoa', 'https://example.com/avatar/r10.jpg', 4, 'Không khí trong lành', 1);

INSERT INTO KhachSan (maDichVu, viTri, tenkhachsan, diaChiChiTiet, soSao, gioCheckIn, gioCheckOut, chinhSachHuy, lat, lng) VALUES
(6, 'Nha Trang', 'Vinpearl Nha Trang', 'Đảo Hòn Tre, Nha Trang', 5, '14:00:00', '12:00:00', 'Miễn phí hủy trước 48h', 12.2167, 109.2400),
(7, 'Đà Nẵng', 'Luxury Đà Nẵng', 'Võ Nguyên Giáp, Đà Nẵng', 5, '14:00:00', '12:00:00', 'Miễn phí hủy trước 48h', 16.0544, 108.2022),
(16, 'Nha Trang', 'Sea View Nha Trang', 'Trần Phú, Nha Trang', 4, '14:00:00', '12:00:00', 'Miễn phí hủy trước 24h', 12.2388, 109.1967),
(17, 'Đà Nẵng', 'Ocean Pearl Đà Nẵng', 'Mỹ Khê, Đà Nẵng', 4, '14:00:00', '12:00:00', 'Miễn phí hủy trước 24h', 16.0678, 108.2450),
(21, 'Nha Trang', 'Central Hotel Nha Trang', 'Nguyễn Thiện Thuật, Nha Trang', 3, '14:00:00', '12:00:00', 'Không hoàn hủy trong 24h', 12.2440, 109.1940),
(22, 'Đà Nẵng', 'Riverfront Đà Nẵng', 'Bạch Đằng, Đà Nẵng', 4, '14:00:00', '12:00:00', 'Miễn phí hủy trước 24h', 16.0710, 108.2240),
(23, 'Nha Trang', 'Family Inn Nha Trang', 'Hùng Vương, Nha Trang', 3, '14:00:00', '12:00:00', 'Miễn phí hủy trước 24h', 12.2420, 109.1950),
(24, 'Đà Nẵng', 'Beach Home Đà Nẵng', 'Hồ Nghinh, Đà Nẵng', 3, '14:00:00', '12:00:00', 'Không hoàn hủy trong 24h', 16.0700, 108.2455),
(25, 'Nha Trang', 'Luxury Bay Nha Trang', 'Phạm Văn Đồng, Nha Trang', 5, '14:00:00', '12:00:00', 'Miễn phí hủy trước 72h', 12.2700, 109.2020),
(26, 'Đà Nẵng', 'Golden Sand Đà Nẵng', 'An Thượng, Đà Nẵng', 4, '14:00:00', '12:00:00', 'Miễn phí hủy trước 48h', 16.0500, 108.2470);

INSERT INTO TienIch (tenTienIch, icon, loaiTienIch, trangThai) VALUES
('Wifi miễn phí', 'wifi', 'KHACH_SAN', 1),
('Hồ bơi', 'pool', 'KHACH_SAN', 1),
('Bữa sáng', 'breakfast', 'KHACH_SAN', 1),
('Điều hòa', 'air-conditioner', 'PHONG', 1),
('Ban công', 'balcony', 'PHONG', 1),
('Hành lý xách tay', 'bag', 'VE', 1),
('Suất ăn', 'meal', 'VE', 1),
('Hướng dẫn viên', 'guide', 'TOUR', 1),
('Xe đưa đón', 'bus', 'TOUR', 1),
('Bảo hiểm du lịch', 'shield', 'TOUR', 1);

INSERT INTO KhachSanTienIch (maKhachSan, maTienIch) VALUES
(1, 1), (2, 1), (3, 2), (4, 2), (5, 3), (6, 3), (7, 1), (8, 2), (9, 3), (10, 1);

INSERT INTO LoaiPhong (maKhachSan, tenLoaiPhong, moTa, giaPhong, sucChua, loaiGiuong, dienTich, huongPhong, soLuongPhongTrong, anhPhong, trangThai) VALUES
(1, 'Deluxe Sea View', 'Phòng deluxe hướng biển', 2200000, 2, 'Giường đôi', '35m2', 'Biển', 8, 'https://example.com/rooms/1.jpg', 1),
(2, 'Premier Ocean', 'Phòng cao cấp view biển', 2500000, 2, 'Giường đôi', '40m2', 'Biển', 6, 'https://example.com/rooms/2.jpg', 1),
(3, 'Superior City', 'Phòng tiêu chuẩn view thành phố', 1200000, 2, 'Giường đôi', '28m2', 'Thành phố', 10, 'https://example.com/rooms/3.jpg', 1),
(4, 'Family Suite', 'Phòng gia đình rộng rãi', 3000000, 4, '2 giường đôi', '55m2', 'Biển', 4, 'https://example.com/rooms/4.jpg', 1),
(5, 'Standard Room', 'Phòng tiết kiệm', 800000, 2, 'Giường đôi', '22m2', 'Thành phố', 12, 'https://example.com/rooms/5.jpg', 1),
(6, 'River View', 'Phòng nhìn sông Hàn', 1600000, 2, 'Giường đôi', '32m2', 'Sông', 7, 'https://example.com/rooms/6.jpg', 1),
(7, 'Triple Room', 'Phòng 3 người', 1400000, 3, '1 đôi 1 đơn', '34m2', 'Thành phố', 9, 'https://example.com/rooms/7.jpg', 1),
(8, 'Beach Studio', 'Studio gần biển', 1100000, 2, 'Giường đôi', '30m2', 'Biển', 5, 'https://example.com/rooms/8.jpg', 1),
(9, 'Luxury Suite', 'Suite cao cấp', 4200000, 4, 'King bed', '70m2', 'Biển', 3, 'https://example.com/rooms/9.jpg', 1),
(10, 'Golden Room', 'Phòng tiện nghi', 1800000, 2, 'Giường đôi', '36m2', 'Biển', 6, 'https://example.com/rooms/10.jpg', 1);

INSERT INTO LoaiPhongTienIch (maLoaiPhong, maTienIch) VALUES
(1, 4), (2, 4), (3, 4), (4, 5), (5, 4), (6, 5), (7, 4), (8, 5), (9, 5), (10, 4);

INSERT INTO KhachSanFAQ (maKhachSan, cauHoi, cauTraLoi, thuTu) VALUES
(1, 'Khách sạn có hồ bơi không?', 'Có hồ bơi ngoài trời miễn phí.', 1),
(2, 'Có gần biển không?', 'Khách sạn cách biển khoảng 200m.', 1),
(3, 'Có bữa sáng không?', 'Có buffet sáng hằng ngày.', 1),
(4, 'Có phòng gia đình không?', 'Có nhiều loại phòng gia đình.', 1),
(5, 'Giờ nhận phòng?', 'Nhận phòng từ 14:00.', 1),
(6, 'Có bãi đỗ xe không?', 'Có bãi đỗ xe miễn phí.', 1),
(7, 'Có cho trẻ em ở cùng không?', 'Trẻ em được ở cùng theo chính sách.', 1),
(8, 'Có đưa đón sân bay không?', 'Có hỗ trợ đặt xe đưa đón.', 1),
(9, 'Có xuất hóa đơn VAT không?', 'Có xuất hóa đơn VAT khi yêu cầu.', 1),
(10, 'Có cho hủy miễn phí không?', 'Có theo chính sách từng phòng.', 1);

INSERT INTO Ve (maDichVu, loaiVeCon, trangThai, tenHienThi, originalPrice, promo) VALUES
(8, 'MAY_BAY', 'AVAILABLE', 'Vé máy bay Hà Nội - TP.HCM', 1800000, 'Giảm 10%'),
(18, 'MAY_BAY', 'AVAILABLE', 'Vé máy bay TP.HCM - Đà Nẵng', 1500000, 'Giá tốt'),
(10, 'MAY_BAY', 'AVAILABLE', 'Vé máy bay Hà Nội - Phú Quốc', 2200000, 'Sale hè'),
(9, 'TAU_HOA', 'AVAILABLE', 'Vé tàu Hà Nội - Đà Nẵng', 900000, 'Tàu đêm'),
(19, 'TAU_HOA', 'AVAILABLE', 'Vé tàu TP.HCM - Nha Trang', 650000, 'Ghế mềm'),
(20, 'TAU_HOA', 'AVAILABLE', 'Vé tàu Hà Nội - Huế', 750000, 'Khoang 4'),
(27, 'MAY_BAY', 'AVAILABLE', 'Vé Sun World Bà Nà Hills', 900000, 'Combo cáp treo'),
(28, 'MAY_BAY', 'AVAILABLE', 'Vé VinWonders Nha Trang', 880000, 'Vé trọn ngày'),
(29, 'TAU_HOA', 'AVAILABLE', 'Vé Safari Phú Quốc', 650000, 'Gia đình'),
(30, 'TAU_HOA', 'AVAILABLE', 'Vé Công viên nước', 450000, 'Cuối tuần');

INSERT INTO VeTienIch (maVe, maTienIch) VALUES
(1, 6), (2, 6), (3, 7), (4, 6), (5, 6), (6, 7), (7, 9), (8, 9), (9, 10), (10, 10);

INSERT INTO VeMayBay (maVe, hangHangKhong, logoHang, soHieuChuyenBay, hangVe, goiGia, diemKhoiHanh, maSanBayDi, tenSanBayDi, diemDen, maSanBayDen, tenSanBayDen, thoiGianKhoiHanh, thoiGianDen, thoiLuongPhut, soDiemDung, hanhLyXachTay, hanhLyKyGui, suatAn, giaiTri, dieuKienVe, thuePhiSanBay) VALUES
(1, 'Vietnam Airlines', 'https://example.com/logo/vna.png', 'VN201', 'Phổ thông', 'Eco', 'Hà Nội', 'HAN', 'Nội Bài', 'TP.HCM', 'SGN', 'Tân Sơn Nhất', '2026-06-01 08:00:00', '2026-06-01 10:10:00', 130, 0, '12kg', '23kg', 'Có', 'Có', 'Đổi vé mất phí', 350000),
(2, 'Vietjet Air', 'https://example.com/logo/vj.png', 'VJ631', 'Phổ thông', 'Eco', 'TP.HCM', 'SGN', 'Tân Sơn Nhất', 'Đà Nẵng', 'DAD', 'Đà Nẵng', '2026-06-02 09:00:00', '2026-06-02 10:20:00', 80, 0, '7kg', '0kg', 'Không', 'Không', 'Không hoàn hủy', 280000),
(3, 'Bamboo Airways', 'https://example.com/logo/qh.png', 'QH1621', 'Phổ thông', 'Smart', 'Hà Nội', 'HAN', 'Nội Bài', 'Phú Quốc', 'PQC', 'Phú Quốc', '2026-06-03 07:30:00', '2026-06-03 09:40:00', 130, 0, '7kg', '20kg', 'Có', 'Không', 'Đổi vé mất phí', 320000),
(7, 'Vietnam Airlines', 'https://example.com/logo/vna.png', 'VN205', 'Thương gia', 'Business', 'Hà Nội', 'HAN', 'Nội Bài', 'TP.HCM', 'SGN', 'Tân Sơn Nhất', '2026-06-04 12:00:00', '2026-06-04 14:10:00', 130, 0, '18kg', '32kg', 'Có', 'Có', 'Linh hoạt đổi vé', 450000),
(8, 'Vietjet Air', 'https://example.com/logo/vj.png', 'VJ633', 'Phổ thông', 'Deluxe', 'TP.HCM', 'SGN', 'Tân Sơn Nhất', 'Đà Nẵng', 'DAD', 'Đà Nẵng', '2026-06-05 15:00:00', '2026-06-05 16:20:00', 80, 0, '7kg', '20kg', 'Có', 'Không', 'Đổi vé mất phí', 300000);

INSERT INTO VeTauHoa (maVe, hangTau, nhaVanHanh, soHieuChuyenTau, diemKhoiHanh, gaKhoiHanh, diemDen, gaDen, thoiGianKhoiHanh, thoiGianDen, thoiLuongPhut, loaiChoMacDinh, chinhSachHoan) VALUES
(4, 'SE1', 'Đường sắt Việt Nam', 'SE1', 'Hà Nội', 'Ga Hà Nội', 'Đà Nẵng', 'Ga Đà Nẵng', '2026-06-01 19:30:00', '2026-06-02 12:00:00', 990, 'Giường nằm', 'Hoàn tiền 100% khi hủy trước 24h'),
(5, 'SE22', 'Đường sắt Việt Nam', 'SE22', 'TP.HCM', 'Ga Sài Gòn', 'Nha Trang', 'Ga Nha Trang', '2026-06-02 20:00:00', '2026-06-03 05:30:00', 570, 'Ghế mềm', 'Hoàn tiền 80% khi hủy trước 24h'),
(6, 'SE3', 'Đường sắt Việt Nam', 'SE3', 'Hà Nội', 'Ga Hà Nội', 'Huế', 'Ga Huế', '2026-06-03 22:00:00', '2026-06-04 10:30:00', 750, 'Khoang 4', 'Hoàn tiền 100% khi hủy trước 24h'),
(9, 'SE5', 'Đường sắt Việt Nam', 'SE5', 'Hà Nội', 'Ga Hà Nội', 'Đà Nẵng', 'Ga Đà Nẵng', '2026-06-04 09:00:00', '2026-06-05 02:00:00', 1020, 'Ghế mềm', 'Hoàn tiền 80% khi hủy trước 24h'),
(10, 'SNT2', 'Đường sắt Việt Nam', 'SNT2', 'TP.HCM', 'Ga Sài Gòn', 'Nha Trang', 'Ga Nha Trang', '2026-06-05 21:00:00', '2026-06-06 06:00:00', 540, 'Giường nằm', 'Hoàn tiền 100% khi hủy trước 24h');

INSERT INTO LoaiVe (tenLoaiVe, moTa, trangThai) VALUES
('Người lớn', 'Vé người lớn', 1),
('Trẻ em', 'Vé trẻ em', 1),
('Em bé', 'Vé em bé', 1),
('Sinh viên', 'Vé sinh viên', 1),
('Người cao tuổi', 'Vé ưu đãi cao tuổi', 1),
('Phổ thông', 'Hạng phổ thông', 1),
('Thương gia', 'Hạng thương gia', 1),
('Ghế mềm', 'Ghế mềm điều hòa', 1),
('Giường nằm', 'Giường nằm khoang tàu', 1),
('Combo gia đình', 'Vé combo gia đình', 1);

INSERT INTO GiaVe (maVe, maLoaiVe, gia, giaGoc, soChoTrong, thuePhi) VALUES
(1, 1, 1800000, 2000000, 20, 350000),
(2, 1, 1500000, 1700000, 25, 280000),
(3, 1, 2200000, 2500000, 18, 320000),
(4, 9, 900000, 1100000, 30, 50000),
(5, 8, 650000, 750000, 40, 40000),
(6, 9, 750000, 850000, 35, 45000),
(7, 1, 900000, 1000000, 100, 0),
(8, 1, 880000, 950000, 90, 0),
(9, 1, 650000, 750000, 80, 0),
(10, 1, 450000, 550000, 120, 0);

INSERT INTO VeTauKhoang (maVe, tenKhoang, toaSo, loaiCho, thuTu) VALUES
(4, 'Khoang A1', '1', 'Giường nằm', 1),
(5, 'Khoang B1', '2', 'Ghế mềm', 1),
(6, 'Khoang C1', '3', 'Khoang 4', 1),
(4, 'Khoang A2', '4', 'Giường nằm', 2),
(5, 'Khoang B2', '5', 'Ghế mềm', 2),
(6, 'Khoang C2', '6', 'Khoang 4', 2),
(4, 'Khoang A3', '7', 'Giường nằm', 3),
(5, 'Khoang B3', '8', 'Ghế mềm', 3),
(6, 'Khoang C3', '9', 'Khoang 4', 3),
(4, 'Khoang A4', '10', 'Giường nằm', 4);

INSERT INTO VeTauGhe (maKhoang, soGhe, trangThai, tang, giaThem) VALUES
(1, 'A1-01', 'AVAILABLE', 1, 0),
(2, 'B1-01', 'AVAILABLE', 1, 0),
(3, 'C1-01', 'AVAILABLE', 1, 50000),
(4, 'A2-01', 'BOOKED', 1, 0),
(5, 'B2-01', 'AVAILABLE', 1, 0),
(6, 'C2-01', 'LOCKED', 2, 50000),
(7, 'A3-01', 'AVAILABLE', 1, 0),
(8, 'B3-01', 'AVAILABLE', 1, 0),
(9, 'C3-01', 'AVAILABLE', 2, 50000),
(10, 'A4-01', 'AVAILABLE', 1, 0);

INSERT INTO DonDat (maUser, maKhuyenMai, tongGia, giaGoc, tongTruocThue, thuePhi, tongSauThue, vatRate, trangThai, loaiDon, ghiChu) VALUES
(2, 1, 3500000, 4200000, 3200000, 300000, 3500000, 8, 'PENDING', 'TOUR', 'Đặt tour Đà Nẵng'),
(3, 2, 2200000, 2400000, 2000000, 200000, 2200000, 8, 'CONFIRMED', 'HOTEL', 'Đặt phòng Nha Trang'),
(4, 4, 1800000, 2000000, 1450000, 350000, 1800000, 8, 'PAID', 'FLIGHT', 'Vé máy bay'),
(5, 5, 900000, 1000000, 850000, 50000, 900000, 8, 'PAID', 'TRAIN', 'Vé tàu'),
(6, 3, 5200000, 5900000, 4800000, 400000, 5200000, 8, 'PENDING', 'TOUR', 'Tour Phú Quốc'),
(7, 6, 3000000, 3400000, 2800000, 200000, 3000000, 8, 'CONFIRMED', 'HOTEL', 'Phòng gia đình'),
(8, 7, 650000, 700000, 650000, 0, 650000, 0, 'PAID', 'ACTIVITY', 'Vé vui chơi'),
(9, 8, 2500000, 3000000, 2300000, 200000, 2500000, 8, 'PENDING', 'TOUR', 'Tour gia đình'),
(10, 9, 880000, 950000, 880000, 0, 880000, 0, 'PAID', 'ACTIVITY', 'VinWonders'),
(2, 10, 7900000, 8900000, 7200000, 700000, 7900000, 8, 'PARTIAL_PAID', 'MIXED', 'Combo nghỉ dưỡng');

INSERT INTO ChiTietDon (maDon, maDichVu, maPhanLoaiDichVu, loaiPhanLoai, soLuong, giaTaiThoiDiemMua, thanhTien, ngayBatDauSuDung, ngayKetThucSuDung, soDem, soNguoiLon, soTreEm, tenSnapshot, moTaSnapshot) VALUES
(1, 1, 1, 'GOI_TOUR', 1, 3500000, 3500000, '2026-06-01 08:00:00', '2026-06-03 18:00:00', NULL, 2, 0, 'Tour Đà Nẵng 3N2Đ', 'Gói tiêu chuẩn'),
(2, 6, 1, 'LOAI_PHONG', 1, 2200000, 2200000, '2026-06-05 14:00:00', '2026-06-06 12:00:00', 1, 2, 0, 'Deluxe Sea View', 'Phòng hướng biển'),
(3, 8, 1, 'GIA_VE', 1, 1800000, 1800000, '2026-06-01 08:00:00', '2026-06-01 10:10:00', NULL, 1, 0, 'Vé máy bay Hà Nội - TP.HCM', 'Vé người lớn'),
(4, 9, 4, 'GIA_VE', 1, 900000, 900000, '2026-06-01 19:30:00', '2026-06-02 12:00:00', NULL, 1, 0, 'Vé tàu Hà Nội - Đà Nẵng', 'Giường nằm'),
(5, 2, 2, 'GOI_TOUR', 1, 5200000, 5200000, '2026-06-05 07:00:00', '2026-06-08 18:00:00', NULL, 2, 1, 'Tour Phú Quốc 4N3Đ', 'Gói cao cấp'),
(6, 7, 4, 'LOAI_PHONG', 1, 3000000, 3000000, '2026-06-10 14:00:00', '2026-06-11 12:00:00', 1, 2, 2, 'Family Suite', 'Phòng gia đình'),
(7, 10, 9, 'GIA_VE', 1, 650000, 650000, '2026-06-12 08:00:00', '2026-06-12 18:00:00', NULL, 1, 0, 'Vé Safari Phú Quốc', 'Vé người lớn'),
(8, 3, 8, 'GOI_TOUR', 1, 2500000, 2500000, '2026-07-01 08:00:00', '2026-07-02 18:00:00', NULL, 2, 2, 'Hạ Long gia đình', 'Gói gia đình'),
(9, 10, 8, 'GIA_VE', 1, 880000, 880000, '2026-06-15 08:00:00', '2026-06-15 18:00:00', NULL, 1, 0, 'Vé VinWonders Nha Trang', 'Vé trọn ngày'),
(10, 2, 7, 'GOI_TOUR', 1, 7900000, 7900000, '2026-06-25 07:00:00', '2026-06-29 18:00:00', NULL, 2, 0, 'Resort Phú Quốc nghỉ dưỡng', 'Gói Luxury');

INSERT INTO ThongTinDatCho (maDon, hoTenLienHe, emailLienHe, sdtLienHe, laNguoiSuDung, tenKhachSuDung, ghiChuYeuCau) VALUES
(1, 'Trần Minh Anh', 'khach01@example.com', '0901000002', 1, 'Trần Minh Anh', 'Ăn chay'),
(2, 'Lê Hoàng Nam', 'khach02@example.com', '0901000003', 1, 'Lê Hoàng Nam', 'Phòng tầng cao'),
(3, 'Phạm Thu Hà', 'khach03@example.com', '0901000004', 1, 'Phạm Thu Hà', 'Ghế gần cửa sổ'),
(4, 'Vũ Đức Tài', 'khach04@example.com', '0901000005', 1, 'Vũ Đức Tài', 'Khoang yên tĩnh'),
(5, 'Đỗ Ngọc Linh', 'khach05@example.com', '0901000006', 1, 'Đỗ Ngọc Linh', 'Có trẻ em'),
(6, 'Bùi Quốc Huy', 'khach06@example.com', '0901000007', 1, 'Bùi Quốc Huy', 'Giường lớn'),
(7, 'Hoàng Mai Chi', 'khach07@example.com', '0901000008', 1, 'Hoàng Mai Chi', 'Không yêu cầu'),
(8, 'Ngô Gia Bảo', 'khach08@example.com', '0901000009', 1, 'Ngô Gia Bảo', 'Có xe đẩy trẻ em'),
(9, 'Đặng Yến Nhi', 'khach09@example.com', '0901000010', 1, 'Đặng Yến Nhi', 'Không yêu cầu'),
(10, 'Trần Minh Anh', 'khach01@example.com', '0901000002', 1, 'Trần Minh Anh', 'Phòng view biển');

INSERT INTO YeuCauDacBiet (maDon, maChiTiet, loaiYeuCau, noiDung, trangThai) VALUES
(1, 1, 'Ăn uống', 'Chuẩn bị suất ăn chay', 'REQUESTED'),
(2, 2, 'Phòng', 'Ưu tiên tầng cao', 'ACCEPTED'),
(3, 3, 'Ghế', 'Ghế gần cửa sổ', 'REQUESTED'),
(4, 4, 'Khoang', 'Khoang yên tĩnh', 'DONE'),
(5, 5, 'Trẻ em', 'Chuẩn bị ghế trẻ em', 'REQUESTED'),
(6, 6, 'Giường', 'Giường lớn', 'ACCEPTED'),
(7, 7, 'Hỗ trợ', 'Hỗ trợ người lớn tuổi', 'REQUESTED'),
(8, 8, 'Gia đình', 'Có xe đẩy trẻ em', 'REQUESTED'),
(9, 9, 'Vé', 'In vé giấy', 'DONE'),
(10, 10, 'Phòng', 'View biển', 'ACCEPTED');

INSERT INTO TieuChiDanhGia (loaiDichVu, tenTieuChi, moTa, thuTu) VALUES
('KHACH_SAN', 'Sạch sẽ', 'Phòng, nhà tắm, ga giường và khu vực chung', 1),
('KHACH_SAN', 'Vị trí', 'Dễ di chuyển, gần trung tâm hoặc điểm tham quan', 2),
('KHACH_SAN', 'Tiện nghi', 'Wifi, điều hòa, hồ bơi, nhà hàng và tiện ích phòng', 3),
('KHACH_SAN', 'Dịch vụ nhân viên', 'Thái độ, tốc độ hỗ trợ, check-in/check-out', 4),
('KHACH_SAN', 'Đáng tiền', 'Chất lượng nhận được so với giá', 5),
('KHACH_SAN', 'Thoải mái', 'Giường, cách âm và không gian nghỉ ngơi', 6),
('MAY_BAY', 'Đúng giờ', 'Cất cánh và hạ cánh đúng lịch', 1),
('MAY_BAY', 'Check-in', 'Quy trình check-in online/offline', 2),
('MAY_BAY', 'Ghế ngồi', 'Khoảng để chân và độ thoải mái', 3),
('MAY_BAY', 'Dịch vụ tiếp viên', 'Thái độ và mức độ hỗ trợ trên chuyến bay', 4),
('MAY_BAY', 'Hành lý', 'Xử lý và thời gian nhận hành lý', 5),
('MAY_BAY', 'Đáng tiền', 'Giá vé so với trải nghiệm', 6),
('TAU', 'Đúng giờ', 'Xuất phát và đến nơi đúng lịch', 1),
('TAU', 'Sạch sẽ', 'Toa tàu, ghế/giường và toilet', 2),
('TAU', 'Thoải mái', 'Ghế, giường, điều hòa và độ ồn', 3),
('TAU', 'An toàn', 'Cảm giác an toàn và hướng dẫn rõ ràng', 4),
('TAU', 'Dịch vụ trên tàu', 'Nhân viên, hỗ trợ và tiện ích trên tàu', 5),
('TAU', 'Đáng tiền', 'Giá vé so với chất lượng', 6),
('TOUR', 'Lịch trình', 'Điểm đến hợp lý, không quá dày', 1),
('TOUR', 'Hướng dẫn viên', 'Kiến thức, thái độ và hỗ trợ khách', 2),
('TOUR', 'Phương tiện', 'Xe đưa đón, tàu/thuyền và độ thoải mái', 3),
('TOUR', 'Ăn uống', 'Chất lượng bữa ăn, vệ sinh, phù hợp khẩu vị', 4),
('TOUR', 'Tổ chức', 'Đúng giờ, rõ ràng và chuyên nghiệp', 5),
('TOUR', 'Đáng tiền', 'Trải nghiệm so với giá tour', 6);

INSERT INTO DanhGia (maUser, maDichVu, maDon, soSao, tieuDe, binhLuan) VALUES
(2, 1, 1, 5, 'Dịch vụ rất đáng tiền', 'Dịch vụ tốt, đặt nhanh và thông tin rõ ràng.'),
(3, 6, 2, 4, 'Phòng sạch, vị trí thuận tiện', 'Phòng sạch, nhân viên hỗ trợ tốt.'),
(4, 8, 3, 5, 'Bay đúng giờ', 'Check-in nhanh, chuyến bay đúng giờ.'),
(5, 9, 4, 4, 'Chuyến tàu ổn', 'Tàu sạch, ghế ngồi ổn, lên tàu dễ.'),
(6, 2, 5, 5, 'Phú Quốc đẹp', 'Lịch trình hợp lý, cảnh đẹp và hướng dẫn viên nhiệt tình.'),
(7, 7, 6, 4, 'Khách sạn đẹp', 'Không gian đẹp, tiện nghi ổn.'),
(8, 10, 7, 5, 'Vui chơi hấp dẫn', 'Hoạt động thú vị, phù hợp gia đình.'),
(9, 3, 8, 4, 'Hạ Long đẹp', 'Tour tổ chức tốt, cảnh rất đẹp.'),
(10, 4, NULL, 5, 'Nha Trang rất vui', 'Biển đẹp, dịch vụ chu đáo.'),
(2, 5, NULL, 4, 'Đà Lạt mát mẻ', 'Trải nghiệm dễ chịu, đáng quay lại.');

INSERT INTO ChiTietDanhGia (maDanhGia, maTieuChi, diem)
SELECT dg.maDanhGia, tc.maTieuChi, LEAST(5, GREATEST(1, dg.soSao - IF(tc.thuTu IN (3,5), 1, 0)))
FROM DanhGia dg
JOIN DichVu dv ON dg.maDichVu = dv.maDichVu
JOIN TieuChiDanhGia tc ON tc.loaiDichVu = CASE
  WHEN dv.loaiDichVu = 'KHACH_SAN' THEN 'KHACH_SAN'
  WHEN dv.loaiDichVu = 'VE_MAY_BAY' THEN 'MAY_BAY'
  WHEN dv.loaiDichVu = 'VE_TAU' THEN 'TAU'
  ELSE 'TOUR'
END;

INSERT INTO AnhDanhGia (maDanhGia, urlAnh, thuTu) VALUES
(2, 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 1),
(3, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', 1),
(5, 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3', 1);

INSERT INTO ThanhToan (maDon, maUser, soTien, phuongThuc, paymentProvider, maGiaoDichNgoai, providerTransactionId, redirectUrl, failureReason, ghiChu, trangThai, ngayThanhToan) VALUES
(1, 2, 3500000, 'VNPAY', 'VNPAY', 'GD001', 'VNP001', 'https://example.com/pay/1', NULL, 'Chờ thanh toán', 'PENDING', NULL),
(2, 3, 2200000, 'MOMO', 'MOMO', 'GD002', 'MM002', 'https://example.com/pay/2', NULL, 'Đã xác nhận', 'PAID', '2026-05-12 09:00:00'),
(3, 4, 1800000, 'BANK_TRANSFER', 'BANK', 'GD003', 'BANK003', NULL, NULL, 'Chuyển khoản', 'PAID', '2026-05-12 09:30:00'),
(4, 5, 900000, 'WALLET', 'WALLET', 'GD004', 'WL004', NULL, NULL, 'Ví điện tử', 'PAID', '2026-05-12 10:00:00'),
(5, 6, 5200000, 'VNPAY', 'VNPAY', 'GD005', 'VNP005', 'https://example.com/pay/5', NULL, 'Chờ thanh toán', 'PENDING', NULL),
(6, 7, 3000000, 'COD', 'COD', 'GD006', 'COD006', NULL, NULL, 'Thanh toán tại nơi', 'PENDING', NULL),
(7, 8, 650000, 'MOMO', 'MOMO', 'GD007', 'MM007', 'https://example.com/pay/7', NULL, 'Đã thanh toán', 'PAID', '2026-05-12 11:00:00'),
(8, 9, 2500000, 'VNPAY', 'VNPAY', 'GD008', 'VNP008', 'https://example.com/pay/8', 'User cancelled', 'Thanh toán lỗi', 'FAILED', NULL),
(9, 10, 880000, 'WALLET', 'WALLET', 'GD009', 'WL009', NULL, NULL, 'Đã thanh toán', 'PAID', '2026-05-12 12:00:00'),
(10, 2, 4000000, 'BANK_TRANSFER', 'BANK', 'GD010', 'BANK010', NULL, NULL, 'Thanh toán một phần', 'PAID', '2026-05-12 13:00:00');

INSERT INTO HoaDonVAT (maDon, tenCongTy, maSoThue, diaChiCongTy, emailNhanHoaDon, trangThai, ngayXuat) VALUES
(1, 'Công ty Du lịch A', '0100000001', 'Hà Nội', 'vat1@example.com', 'REQUESTED', NULL),
(2, 'Công ty Dịch vụ B', '0100000002', 'TP.HCM', 'vat2@example.com', 'ISSUED', '2026-05-12 09:10:00'),
(3, 'Công ty Bay C', '0100000003', 'Đà Nẵng', 'vat3@example.com', 'ISSUED', '2026-05-12 09:40:00'),
(4, 'Công ty Tàu D', '0100000004', 'Huế', 'vat4@example.com', 'ISSUED', '2026-05-12 10:10:00'),
(5, 'Công ty Tour E', '0100000005', 'Cần Thơ', 'vat5@example.com', 'REQUESTED', NULL),
(6, 'Công ty Hotel F', '0100000006', 'Đà Lạt', 'vat6@example.com', 'REQUESTED', NULL),
(7, 'Công ty Vé G', '0100000007', 'Quảng Ninh', 'vat7@example.com', 'ISSUED', '2026-05-12 11:10:00'),
(8, 'Công ty Family H', '0100000008', 'Nha Trang', 'vat8@example.com', 'CANCELLED', NULL),
(9, 'Công ty Wonder I', '0100000009', 'Phú Quốc', 'vat9@example.com', 'ISSUED', '2026-05-12 12:10:00'),
(10, 'Công ty Resort K', '0100000010', 'Đà Nẵng', 'vat10@example.com', 'REQUESTED', NULL);
