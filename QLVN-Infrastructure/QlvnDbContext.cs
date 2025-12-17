using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QLVN_Infrastructure.Entities;

namespace QLVN_Infrastructure;

public partial class QlvnDbContext : DbContext
{
    public QlvnDbContext()
    {
    }

    public QlvnDbContext(DbContextOptions<QlvnDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DbAoNuoi> DbAoNuois { get; set; }

    public virtual DbSet<DbAoNuoiNhapCaHao> DbAoNuoiNhapCaHaos { get; set; }

    public virtual DbSet<DbAoNuoiNhapHc> DbAoNuoiNhapHcs { get; set; }

    public virtual DbSet<DbAoNuoiNhapKc> DbAoNuoiNhapKcs { get; set; }

    public virtual DbSet<DbAoNuoiNhapKhac> DbAoNuoiNhapKhacs { get; set; }

    public virtual DbSet<DbAoNuoiNhapMt> DbAoNuoiNhapMts { get; set; }

    public virtual DbSet<DbAoNuoiNhapSl> DbAoNuoiNhapSls { get; set; }

    public virtual DbSet<DbAoNuoiNhapTg> DbAoNuoiNhapTgs { get; set; }

    public virtual DbSet<DbAoNuoiNhapTh> DbAoNuoiNhapThs { get; set; }

    public virtual DbSet<DbAoNuoiNhapTum> DbAoNuoiNhapTa { get; set; }

    public virtual DbSet<DbDvsd> DbDvsds { get; set; }

    public virtual DbSet<DbHoaChat> DbHoaChats { get; set; }

    public virtual DbSet<DbKhachHang> DbKhachHangs { get; set; }

    public virtual DbSet<DbKhangSinhKq> DbKhangSinhKqs { get; set; }

    public virtual DbSet<DbKhangSinhYc> DbKhangSinhYcs { get; set; }

    public virtual DbSet<DbKhuVuc> DbKhuVucs { get; set; }

    public virtual DbSet<DbLoaiBenh> DbLoaiBenhs { get; set; }

    public virtual DbSet<DbLoaiCa> DbLoaiCas { get; set; }

    public virtual DbSet<DbNhaCungCap> DbNhaCungCaps { get; set; }

    public virtual DbSet<DbNhapTum> DbNhapTa { get; set; }

    public virtual DbSet<DbSizeNl> DbSizeNls { get; set; }

    public virtual DbSet<DbTangTrong> DbTangTrongs { get; set; }

    public virtual DbSet<SysMenu> SysMenus { get; set; }

    public virtual DbSet<SysSetting> SysSettings { get; set; }

    public virtual DbSet<SysSystemInfo> SysSystemInfos { get; set; }

    public virtual DbSet<UsGridLayout> UsGridLayouts { get; set; }

    public virtual DbSet<UsGroup> UsGroups { get; set; }

    public virtual DbSet<UsUser> UsUsers { get; set; }

    public virtual DbSet<UsUserLog> UsUserLogs { get; set; }

    public virtual DbSet<UsUserPermission> UsUserPermissions { get; set; }

    public virtual DbSet<VUserLog> VUserLogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=IDI_QLVN;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DbAoNuoi>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F476164D4");

            entity.ToTable("DbAoNuoi");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CongXuatNuoi).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DiaChi).HasMaxLength(500);
            entity.Property(e => e.DienTich).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.GiaGiaCong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.KhachHangMa).HasMaxLength(50);
            entity.Property(e => e.KhuVucMa).HasMaxLength(5);
            entity.Property(e => e.MaSo).HasMaxLength(50);
            entity.Property(e => e.NgayHd)
                .HasMaxLength(50)
                .HasColumnName("NgayHD");
            entity.Property(e => e.NhanVienGsma)
                .HasMaxLength(50)
                .HasColumnName("NhanVienGSMa");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.SlduKien)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("SLDuKien");
            entity.Property(e => e.SoHd)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("SoHD");
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapCaHao>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9FE2E07472");

            entity.ToTable("DbAoNuoi_NhapCaHao");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.SoCon).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.SoKg).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapHc>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F05DB5822");

            entity.ToTable("DbAoNuoi_NhapHC");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.HoaChatMa).HasMaxLength(5);
            entity.Property(e => e.MaSoLo).HasMaxLength(10);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.SoLuong).HasColumnType("numeric(18, 2)");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapKc>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F72431E69");

            entity.ToTable("DbAoNuoi_NhapKC");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.LuongGiong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.LuongThucAn).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.MauGiong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapKhac>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F7DCF1035");

            entity.ToTable("DbAoNuoi_NhapKhac");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CaBenhMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.ThayNuoc).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Ttbq)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TTBQ");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapMt>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F08A547B6");

            entity.ToTable("DbAoNuoi_NhapMT");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.H2s)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("H2S");
            entity.Property(e => e.Kh)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("KH");
            entity.Property(e => e.Nh3)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("NH3");
            entity.Property(e => e.NhietDo).HasColumnType("numeric(18, 1)");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.O2Chieu)
                .HasColumnType("numeric(18, 1)")
                .HasColumnName("O2_Chieu");
            entity.Property(e => e.O2Sang)
                .HasColumnType("numeric(18, 1)")
                .HasColumnName("O2_Sang");
            entity.Property(e => e.PhChieu)
                .HasColumnType("numeric(18, 1)")
                .HasColumnName("PH_Chieu");
            entity.Property(e => e.PhSang)
                .HasColumnType("numeric(18, 1)")
                .HasColumnName("PH_Sang");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapSl>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F4A699C89");

            entity.ToTable("DbAoNuoi_NhapSL");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.LuongGiong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapTg>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F8E0A40D2");

            entity.ToTable("DbAoNuoi_NhapTG");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.GiaGiong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.LuongGiong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.MauGiong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapTh>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9F85F60422");

            entity.ToTable("DbAoNuoi_NhapTH");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.SanLuong).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Size).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.Ta2mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_2mm");
            entity.Property(e => e.Ta3mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_3mm");
            entity.Property(e => e.Ta5mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_5mm");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbAoNuoiNhapTum>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbAoNuoi__3214CC9FB5D38868");

            entity.ToTable("DbAoNuoi_NhapTA");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.MaLo).HasMaxLength(10);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ta2mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_2mm");
            entity.Property(e => e.Ta3mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_3mm");
            entity.Property(e => e.Ta5mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_5mm");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbDvsd>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbDvsd__3214CC9FA7CF90DF");

            entity.ToTable("DbDvsd");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.Cccd)
                .HasMaxLength(50)
                .HasColumnName("CCCD");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DiaChi).HasMaxLength(500);
            entity.Property(e => e.Mst)
                .HasMaxLength(500)
                .HasColumnName("MST");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Stk)
                .HasMaxLength(50)
                .HasColumnName("STK");
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbHoaChat>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbHoaCha__3214CC9F2BBC8C82");

            entity.ToTable("DbHoaChat");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbKhachHang>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbKhachH__3214CC9F078703B1");

            entity.ToTable("DbKhachHang");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.Cccd)
                .HasMaxLength(50)
                .HasColumnName("CCCD");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DiaChi).HasMaxLength(500);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Stk)
                .HasMaxLength(50)
                .HasColumnName("STK");
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.TenNganHang).HasMaxLength(500);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbKhangSinhKq>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbKhangS__3214CC9FB93EC57C");

            entity.ToTable("DbKhangSinh_KQ");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.Ahd)
                .HasMaxLength(10)
                .HasColumnName("AHD");
            entity.Property(e => e.Amoz)
                .HasMaxLength(10)
                .HasColumnName("AMOZ");
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.Aoz)
                .HasMaxLength(10)
                .HasColumnName("AOZ");
            entity.Property(e => e.Cap)
                .HasMaxLength(10)
                .HasColumnName("CAP");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Enro)
                .HasMaxLength(10)
                .HasColumnName("ENRO");
            entity.Property(e => e.Flu)
                .HasMaxLength(10)
                .HasColumnName("FLU");
            entity.Property(e => e.MaKhangSinh).HasMaxLength(50);
            entity.Property(e => e.Mglmg)
                .HasMaxLength(10)
                .HasColumnName("MGLMG");
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Sem)
                .HasMaxLength(10)
                .HasColumnName("SEM");
            entity.Property(e => e.TenNguoiKiem).HasMaxLength(200);
            entity.Property(e => e.Trf)
                .HasMaxLength(10)
                .HasColumnName("TRF");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbKhangSinhYc>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbKhangS__3214CC9F7AE8E77D");

            entity.ToTable("DbKhangSinh_YC");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.Ahd).HasColumnName("AHD");
            entity.Property(e => e.Amoz).HasColumnName("AMOZ");
            entity.Property(e => e.AoNuoiMa).HasMaxLength(5);
            entity.Property(e => e.Aoz).HasColumnName("AOZ");
            entity.Property(e => e.Cap).HasColumnName("CAP");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Enro).HasColumnName("ENRO");
            entity.Property(e => e.Flu).HasColumnName("FLU");
            entity.Property(e => e.Mglmg).HasColumnName("MGLMG");
            entity.Property(e => e.Sem).HasColumnName("SEM");
            entity.Property(e => e.Trf).HasColumnName("TRF");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbKhuVuc>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbKhuVuc__3214CC9F73DC743A");

            entity.ToTable("DbKhuVuc");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.TinhThanh).HasMaxLength(500);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbLoaiBenh>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbLoaiBe__3214CC9F3A04CA26");

            entity.ToTable("DbLoaiBenh");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbLoaiCa>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbLoaiCa__3214CC9F1CAEC5A6");

            entity.ToTable("DbLoaiCa");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbNhaCungCap>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbNhaCun__3214CC9F7CD94D4B");

            entity.ToTable("DbNhaCungCap");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.Cccd)
                .HasMaxLength(50)
                .HasColumnName("CCCD");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DiaChi).HasMaxLength(500);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Stk)
                .HasMaxLength(50)
                .HasColumnName("STK");
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.TenNganHang).HasMaxLength(500);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbNhapTum>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbNhapTA__3214CC9F2A8B57AC");

            entity.ToTable("DbNhapTA");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.KhucVucMa).HasMaxLength(5);
            entity.Property(e => e.NhaCungCapMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ta2mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_2mm");
            entity.Property(e => e.Ta3mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_3mm");
            entity.Property(e => e.Ta5mm)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("TA_5mm");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbSizeNl>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbSizeNL__3214CC9F163B1ACB");

            entity.ToTable("DbSizeNL");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<DbTangTrong>(entity =>
        {
            entity.HasKey(e => e.Ma).HasName("PK__DbTangTr__3214CC9F5881404B");

            entity.ToTable("DbTangTrong");

            entity.Property(e => e.Ma).HasMaxLength(5);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.DvsdMa).HasMaxLength(5);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Ten).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<SysMenu>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("PK__SysMenu__737584F7E650AE28");

            entity.ToTable("SysMenu");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.ParentMenu).HasMaxLength(50);
        });

        modelBuilder.Entity<SysSetting>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK__SysSetti__C41E028809778466");

            entity.ToTable("SysSetting");

            entity.Property(e => e.Key).HasMaxLength(30);
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
            entity.Property(e => e.Value).HasMaxLength(500);

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SysSettings)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SysSetting_UsUserUpdated");
        });

        modelBuilder.Entity<SysSystemInfo>(entity =>
        {
            entity.HasKey(e => e.Ctyma).HasName("PK__SysSyste__D3C49BABAF1264D2");

            entity.ToTable("SysSystemInfo");

            entity.Property(e => e.Ctyma)
                .HasMaxLength(5)
                .HasColumnName("CTYMa");
            entity.Property(e => e.CtydiaChi)
                .HasMaxLength(500)
                .HasColumnName("CTYDiaChi");
            entity.Property(e => e.CtydienThoai)
                .HasMaxLength(30)
                .HasColumnName("CTYDienThoai");
            entity.Property(e => e.Ctyemail)
                .HasMaxLength(30)
                .HasColumnName("CTYEmail");
            entity.Property(e => e.Ctyfax)
                .HasMaxLength(50)
                .HasColumnName("CTYFax");
            entity.Property(e => e.CtymaSoThue)
                .HasMaxLength(20)
                .HasColumnName("CTYMaSoThue");
            entity.Property(e => e.CtysoTaiKhoan)
                .HasMaxLength(20)
                .HasColumnName("CTYSoTaiKhoan");
            entity.Property(e => e.Ctyten)
                .HasMaxLength(200)
                .HasColumnName("CTYTen");
            entity.Property(e => e.CtytenNganHang)
                .HasMaxLength(100)
                .HasColumnName("CTYTenNganHang");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
            entity.Property(e => e.VersionApp).HasMaxLength(10);

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SysSystemInfos)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SysSystemInfo_UsUserUpdated");
        });

        modelBuilder.Entity<UsGridLayout>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UsGridLa__3214EC07C1A3E90C");

            entity.ToTable("UsGridLayout");

            entity.Property(e => e.Id).HasMaxLength(300);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasMaxLength(8);

            entity.HasOne(d => d.User).WithMany(p => p.UsGridLayouts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UsGridLayout_UsUser");
        });

        modelBuilder.Entity<UsGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UsGroup__3214EC07E14F8E65");

            entity.ToTable("UsGroup");

            entity.Property(e => e.Id).HasMaxLength(3);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Note).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
        });

        modelBuilder.Entity<UsUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UsUser__3214EC07C5782589");

            entity.ToTable("UsUser");

            entity.Property(e => e.Id).HasMaxLength(8);
            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.Cmnd)
                .HasMaxLength(20)
                .HasColumnName("CMND");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(8);
            entity.Property(e => e.Email).HasMaxLength(30);
            entity.Property(e => e.GroupId).HasMaxLength(3);
            entity.Property(e => e.Image).HasMaxLength(200);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);
            entity.Property(e => e.UserName).HasMaxLength(10);
        });

        modelBuilder.Entity<UsUserLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UsUserLo__3214EC0777E6A1A6");

            entity.ToTable("UsUserLog");

            entity.Property(e => e.Id).HasMaxLength(30);
            entity.Property(e => e.ActionDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ActionName).HasMaxLength(100);
            entity.Property(e => e.ComputerName).HasMaxLength(50);
            entity.Property(e => e.Data).HasMaxLength(3000);
            entity.Property(e => e.Menu).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(2000);
            entity.Property(e => e.UserId).HasMaxLength(8);

            entity.HasOne(d => d.User).WithMany(p => p.UsUserLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UsUserLog_UsUser");
        });

        modelBuilder.Entity<UsUserPermission>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.MenuId }).HasName("PK__UsUserPe__0B11216F3439805E");

            entity.ToTable("UsUserPermission");

            entity.Property(e => e.UserId).HasMaxLength(8);
            entity.Property(e => e.MenuId).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasMaxLength(8);

            entity.HasOne(d => d.Menu).WithMany(p => p.UsUserPermissions)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UsUserPermission_SysMenu");

            entity.HasOne(d => d.User).WithMany(p => p.UsUserPermissions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UsUserPermission_UsUser");
        });

        modelBuilder.Entity<VUserLog>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vUserLog");

            entity.Property(e => e.ActionDate).HasColumnType("datetime");
            entity.Property(e => e.ActionName).HasMaxLength(100);
            entity.Property(e => e.ComputerName).HasMaxLength(50);
            entity.Property(e => e.Data).HasMaxLength(3000);
            entity.Property(e => e.GroupId).HasMaxLength(3);
            entity.Property(e => e.GroupName).HasMaxLength(100);
            entity.Property(e => e.Id).HasMaxLength(30);
            entity.Property(e => e.Menu).HasMaxLength(50);
            entity.Property(e => e.Note).HasMaxLength(2000);
            entity.Property(e => e.TenNv)
                .HasMaxLength(100)
                .HasColumnName("TenNV");
            entity.Property(e => e.UserId).HasMaxLength(8);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
