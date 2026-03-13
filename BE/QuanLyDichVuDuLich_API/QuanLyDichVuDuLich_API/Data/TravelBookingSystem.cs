using Microsoft.EntityFrameworkCore;
using Models;

namespace QuanLyDichVuDuLich_API.Data
{
    public class TravelBookingContext : DbContext
    {
        public TravelBookingContext(DbContextOptions<TravelBookingContext> options)
            : base(options)
        {
        }

        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<QuanTriVien> QuanTriViens { get; set; }
        public DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public DbSet<DichVu> DichVus { get; set; }
        public DbSet<Ve> Ves { get; set; }
        public DbSet<KhachSan> KhachSans { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<DonDat> DonDats { get; set; }
        public DbSet<ChiTietDon> ChiTietDons { get; set; }
        public DbSet<ThanhToan> ThanhToans { get; set; }
        public DbSet<DanhGia> DanhGias { get; set; }
        public DbSet<KhuyenMai> KhuyenMais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TaiKhoan -> NguoiDung
            modelBuilder.Entity<NguoiDung>()
                .HasOne<TaiKhoan>()
                .WithMany()
                .HasForeignKey(nd => nd.accID)
                .OnDelete(DeleteBehavior.Restrict);

            // TaiKhoan -> QuanTriVien
            modelBuilder.Entity<QuanTriVien>()
                .HasOne<TaiKhoan>()
                .WithMany()
                .HasForeignKey(qt => qt.accID)
                .OnDelete(DeleteBehavior.Restrict);

            // NhaCungCap -> DichVu
            modelBuilder.Entity<DichVu>()
                .HasOne<NhaCungCap>()
                .WithMany()
                .HasForeignKey(dv => dv.maNhaCungCap);

            // DichVu -> Ve
            modelBuilder.Entity<Ve>()
                .HasOne<DichVu>()
                .WithMany()
                .HasForeignKey(v => v.maDichVu);

            // DichVu -> KhachSan
            modelBuilder.Entity<KhachSan>()
                .HasOne<DichVu>()
                .WithMany()
                .HasForeignKey(ks => ks.maDichVu);

            // DichVu -> Tour
            modelBuilder.Entity<Tour>()
                .HasOne<DichVu>()
                .WithMany()
                .HasForeignKey(t => t.maDichVu);

            // NguoiDung -> DonDat
            modelBuilder.Entity<DonDat>()
                .HasOne<NguoiDung>()
                .WithMany()
                .HasForeignKey(dd => dd.maNguoiDung);

            // DonDat -> ChiTietDon
            modelBuilder.Entity<ChiTietDon>()
                .HasOne<DonDat>()
                .WithMany()
                .HasForeignKey(ct => ct.maDon);

            // DichVu -> ChiTietDon
            modelBuilder.Entity<ChiTietDon>()
                .HasOne<DichVu>()
                .WithMany()
                .HasForeignKey(ct => ct.maDichVu);

            // DonDat -> ThanhToan
            modelBuilder.Entity<ThanhToan>()
                .HasOne<DonDat>()
                .WithMany()
                .HasForeignKey(tt => tt.maDon);

            // NguoiDung -> DanhGia
            modelBuilder.Entity<DanhGia>()
                .HasOne<NguoiDung>()
                .WithMany()
                .HasForeignKey(dg => dg.maNguoiDung);

            // DichVu -> DanhGia
            modelBuilder.Entity<DanhGia>()
                .HasOne<DichVu>()
                .WithMany()
                .HasForeignKey(dg => dg.maDichVu);
        }
    }
}