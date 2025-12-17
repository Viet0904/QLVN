

-- 1. TẠO DATABASE (Nếu chưa có)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'IDI_QLVN')
BEGIN
    CREATE DATABASE [IDI_QLVN]
END
GO

USE [IDI_QLVN]
GO

-- 2. TẠO CÁC BẢNG HỆ THỐNG & PHÂN QUYỀN (SYSTEM)
CREATE TABLE [dbo].[UsGroup](
    [Id] [nvarchar](3) NOT NULL PRIMARY KEY,
    [Name] [nvarchar](100) NOT NULL,
    [Note] [nvarchar](200) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NULL
)
GO

CREATE TABLE [dbo].[UsUser](
    [Id] [nvarchar](8) NOT NULL PRIMARY KEY,
    [GroupId] [nvarchar](3) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Gender] [int] NULL,
    [UserName] [nvarchar](10) NOT NULL,
    [Password] [nvarchar](200) NOT NULL,
    [Email] [nvarchar](30) NULL,
    [Phone] [nvarchar](50) NULL,
    [CMND] [nvarchar](20) NULL,
    [Address] [nvarchar](200) NULL,
    [Image] [nvarchar](200) NULL,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[SysMenu](
    [Name] [nvarchar](50) NOT NULL PRIMARY KEY,
    [ParentMenu] [nvarchar](50) NULL,
    [Note] [nvarchar](100) NOT NULL,
    [IsActive] [int] NULL
)
GO

CREATE TABLE [dbo].[UsUserPermission](
    [UserId] [nvarchar](8) NOT NULL,
    [MenuId] [nvarchar](50) NOT NULL,
    [Xem] [bit] NULL,
    [Them] [bit] NULL,
    [Sua] [bit] NULL,
    [SuaHangLoat] [bit] NULL,
    [Xoa] [bit] NULL,
    [XoaHangLoat] [bit] NULL,
    [XuatDuLieu] [bit] NULL,
    [Khac] [bit] NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NULL,
    PRIMARY KEY ([UserId], [MenuId])
)
GO

CREATE TABLE [dbo].[UsUserLog](
    [Id] [nvarchar](30) NOT NULL PRIMARY KEY,
    [UserId] [nvarchar](8) NOT NULL,
    [Menu] [nvarchar](50) NOT NULL,
    [ComputerName] [nvarchar](50) NOT NULL,
    [ActionName] [nvarchar](100) NOT NULL,
    [Data] [nvarchar](3000) NULL,
    [Note] [nvarchar](2000) NULL,
    [ActionDate] [datetime] NOT NULL DEFAULT GETDATE()
)
GO

CREATE TABLE [dbo].[UsGridLayout](
    [Id] [nvarchar](300) NOT NULL PRIMARY KEY,
    [UserId] [nvarchar](8) NOT NULL,
    [Layout] [nvarchar](max) NULL,
    [UpdatedAt] [datetime] NULL
)
GO

CREATE TABLE [dbo].[SysSetting](
    [Key] [nvarchar](30) NOT NULL PRIMARY KEY,
    [Description] [nvarchar](100) NULL,
    [Value] [nvarchar](500) NOT NULL,
    [Type] [int] NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[SysSystemInfo](
    [CTYMa] [nvarchar](5) NOT NULL PRIMARY KEY,
    [CTYTen] [nvarchar](200) NULL,
    [CTYDiaChi] [nvarchar](500) NULL,
    [CTYMaSoThue] [nvarchar](20) NULL,
    [CTYDienThoai] [nvarchar](30) NULL,
    [CTYFax] [nvarchar](50) NULL,
    [CTYEmail] [nvarchar](30) NULL,
    [CTYSoTaiKhoan] [nvarchar](20) NULL,
    [CTYTenNganHang] [nvarchar](100) NULL,
    [VersionApp] [nvarchar](10) NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

-- 3. TẠO CÁC BẢNG DANH MỤC (MASTER DATA)
CREATE TABLE [dbo].[DbDvsd](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [DiaChi] [nvarchar](500) NULL,
    [Phone] [nvarchar](50) NULL,
    [CCCD] [nvarchar](50) NULL,
    [MST] [nvarchar](500) NULL,
    [STK] [nvarchar](50) NULL,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbKhuVuc](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [TinhThanh] [nvarchar](500) NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbNhaCungCap](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [DiaChi] [nvarchar](500) NULL,
    [Phone] [nvarchar](50) NULL,
    [CCCD] [nvarchar](50) NULL,
    [TenNganHang] [nvarchar](500) NULL,
    [STK] [nvarchar](50) NULL,
    [GoogleMap] [nvarchar](max) NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbKhachHang](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [DiaChi] [nvarchar](500) NULL,
    [Phone] [nvarchar](50) NULL,
    [CCCD] [nvarchar](50) NULL,
    [TenNganHang] [nvarchar](500) NULL,
    [STK] [nvarchar](50) NULL,
    [GoogleMap] [nvarchar](max) NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbHoaChat](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbLoaiBenh](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbLoaiCa](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbSizeNL](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbTangTrong](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [Ten] [nvarchar](50) NOT NULL,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

-- 4. TẠO BẢNG CHÍNH VÀ CÁC BẢNG NHẬP LIỆU (TRANSACTION)
CREATE TABLE [dbo].[DbAoNuoi](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [MaSo] [nvarchar](50) NULL,
    [Ten] [nvarchar](50) NOT NULL,
    [NgayCap] [date] NULL,
    [DiaChi] [nvarchar](500) NULL,
    [DienTich] [numeric](18, 0) NOT NULL DEFAULT 0,
    [NgayThuHoach] [date] NULL,
    [SLDuKien] [numeric](18, 0) NOT NULL DEFAULT 0,
    [SoHD] [nchar](10) NULL,
    [NgayHD] [nvarchar](50) NULL,
    [GiaGiaCong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [NhanVienGSMa] [nvarchar](50) NULL,
    [CongXuatNuoi] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TinhTrang] [bit] NOT NULL DEFAULT 0,
    [KhachHangMa] [nvarchar](50) NOT NULL,
    [KhuVucMa] [nvarchar](5) NOT NULL,
    [GoogleMap] [nvarchar](max) NULL,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

-- Các bảng con của AoNuoi
CREATE TABLE [dbo].[DbAoNuoi_NhapCaHao](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [SoCon] [numeric](18, 0) NOT NULL DEFAULT 0,
    [SoKg] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapHC](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [HoaChatMa] [nvarchar](5) NOT NULL, 
    [MaSoLo] [nvarchar](10) NULL,
    [SoLuong] [numeric](18, 2) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapKC](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [NgayKiem] [date] NOT NULL,
    [LuongGiong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [MauGiong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [LuongThucAn] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapKhac](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [ThayNuoc] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TTBQ] [numeric](18, 0) NOT NULL DEFAULT 0,
    [CaBenhMa] [nvarchar](5) NULL,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapMT](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [NhietDo] [numeric](18, 1) NOT NULL DEFAULT 0,
    [PH_Sang] [numeric](18, 1) NOT NULL DEFAULT 0,
    [PH_Chieu] [numeric](18, 1) NOT NULL DEFAULT 0,
    [O2_Sang] [numeric](18, 1) NOT NULL DEFAULT 0,
    [O2_Chieu] [numeric](18, 1) NOT NULL DEFAULT 0,
    [NH3] [numeric](18, 2) NOT NULL DEFAULT 0,
    [H2S] [numeric](18, 2) NOT NULL DEFAULT 0,
    [KH] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapSL](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [NgayKiem] [date] NOT NULL,
    [LuongGiong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapTA](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [Ten] [nvarchar](max) NULL,
    [MaLo] [nvarchar](10) NULL,
    [TA_2mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_3mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_5mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapTG](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [NgayThaGiong] [date] NOT NULL,
    [LuongGiong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [MauGiong] [numeric](18, 0) NULL,
    [GiaGiong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbAoNuoi_NhapTH](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [Size] [numeric](18, 0) NOT NULL DEFAULT 0,
    [SanLuong] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_2mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_3mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_5mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbKhangSinh_KQ](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [MaKhangSinh] [nvarchar](50) NOT NULL,
    [NgayKiem] [date] NOT NULL,
    [AOZ] [nvarchar](10) NULL,
    [CAP] [nvarchar](10) NULL,
    [FLU] [nvarchar](10) NULL,
    [ENRO] [nvarchar](10) NULL,
    [MGLMG] [nvarchar](10) NULL,
    [TRF] [nvarchar](10) NULL,
    [AMOZ] [nvarchar](10) NULL,
    [AHD] [nvarchar](10) NULL,
    [SEM] [nvarchar](10) NULL,
    [TenNguoiKiem] [nvarchar](200) NULL,
    [Note] [nvarchar](100) NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbKhangSinh_YC](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [AoNuoiMa] [nvarchar](5) NOT NULL,
    [NoiDungKiem] [nvarchar](max) NULL,
    [NgayYeuCau] [date] NOT NULL,
    [AOZ] [bit] NOT NULL DEFAULT 0,
    [CAP] [bit] NOT NULL DEFAULT 0,
    [FLU] [bit] NOT NULL DEFAULT 0,
    [ENRO] [bit] NOT NULL DEFAULT 0,
    [MGLMG] [bit] NOT NULL DEFAULT 0,
    [TRF] [bit] NOT NULL DEFAULT 0,
    [AMOZ] [bit] NOT NULL DEFAULT 0,
    [AHD] [bit] NOT NULL DEFAULT 0,
    [SEM] [bit] NOT NULL DEFAULT 0,
    [Note] [bit] NOT NULL DEFAULT 0,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

CREATE TABLE [dbo].[DbNhapTA](
    [Ma] [nvarchar](5) NOT NULL PRIMARY KEY,
    [KhucVucMa] [nvarchar](5) NOT NULL,
    [NhaCungCapMa] [nvarchar](5) NOT NULL,
    [Ngay] [date] NOT NULL,
    [TA_2mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_3mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [TA_5mm] [numeric](18, 0) NOT NULL DEFAULT 0,
    [Note] [nvarchar](100) NULL,
    [DvsdMa] [nvarchar](5) NOT NULL,
    [RowStatus] [int] NOT NULL DEFAULT 1,
    [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [CreatedBy] [nvarchar](8) NOT NULL,
    [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
    [UpdatedBy] [nvarchar](8) NOT NULL
)
GO

-- 5. TẠO VIEW
GO
CREATE VIEW [dbo].[vUserLog]
AS
SELECT 
    dbo.UsGroup.Id AS GroupId, 
    dbo.UsGroup.Name AS GroupName, 
    dbo.UsUser.Id AS UserId, 
    dbo.UsUser.Name AS TenNV,  
    dbo.UsUserLog.Id, 
    dbo.UsUserLog.Menu, 
    dbo.UsUserLog.ComputerName, 
    dbo.UsUserLog.ActionName, 
    dbo.UsUserLog.Note, 
    dbo.UsUserLog.ActionDate, 
    dbo.UsUserLog.Data
FROM dbo.UsGroup 
INNER JOIN dbo.UsUser ON dbo.UsGroup.Id = dbo.UsUser.GroupId 
INNER JOIN dbo.UsUserLog ON dbo.UsUser.Id = dbo.UsUserLog.UserId
GO

-- 6. TẠO KHÓA NGOẠI (FOREIGN KEYS) 
ALTER TABLE [dbo].[SysSetting] ADD CONSTRAINT [FK_SysSetting_UsUserUpdated] FOREIGN KEY([UpdatedBy]) REFERENCES [dbo].[UsUser] ([Id])
ALTER TABLE [dbo].[SysSystemInfo] ADD CONSTRAINT [FK_SysSystemInfo_UsUserUpdated] FOREIGN KEY([UpdatedBy]) REFERENCES [dbo].[UsUser] ([Id])
ALTER TABLE [dbo].[UsGridLayout] ADD CONSTRAINT [FK_UsGridLayout_UsUser] FOREIGN KEY([UserId]) REFERENCES [dbo].[UsUser] ([Id])
ALTER TABLE [dbo].[UsUserLog] ADD CONSTRAINT [FK_UsUserLog_UsUser] FOREIGN KEY([UserId]) REFERENCES [dbo].[UsUser] ([Id])
ALTER TABLE [dbo].[UsUserPermission] ADD CONSTRAINT [FK_UsUserPermission_SysMenu] FOREIGN KEY([MenuId]) REFERENCES [dbo].[SysMenu] ([Name])
ALTER TABLE [dbo].[UsUserPermission] ADD CONSTRAINT [FK_UsUserPermission_UsUser] FOREIGN KEY([UserId]) REFERENCES [dbo].[UsUser] ([Id])
GO

-- 7. TẠO STORED PROCEDURES
GO
CREATE PROCEDURE [dbo].[SpIU_UserPermission] 
	@Json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @PermissionTable AS TABLE(
		UserId NVARCHAR(8), MenuId NVARCHAR(50), Xem BIT, Them BIT, Sua BIT, Xoa BIT, 
		SuaHangLoat BIT, XoaHangLoat BIT, XuatDuLieu BIT, Khac BIT, UpdatedAt DATETIME, UpdatedBy NVARCHAR(50)
	);

	INSERT INTO @PermissionTable
	SELECT UserId, MenuId, Xem, Them, Sua, Xoa, SuaHangLoat, XoaHangLoat, XuatDuLieu, Khac, UpdatedAt, UpdatedBy
	FROM OPENJSON(@Json)
	WITH (
		UserId NVARCHAR(8), MenuId NVARCHAR(50), Xem BIT, Them BIT, Sua BIT, Xoa BIT, 
		SuaHangLoat BIT, XoaHangLoat BIT, XuatDuLieu BIT, Khac BIT, UpdatedAt DATETIME, UpdatedBy NVARCHAR(50)
	);

	UPDATE [dbo].[UsUserPermission] SET 
		[dbo].[UsUserPermission].Xem = tb.Xem,
		[dbo].[UsUserPermission].Them = tb.Them,
		[dbo].[UsUserPermission].Sua = tb.Sua,
		[dbo].[UsUserPermission].Xoa = tb.Xoa,
		[dbo].[UsUserPermission].SuaHangLoat = tb.SuaHangLoat,
		[dbo].[UsUserPermission].XoaHangLoat = tb.XoaHangLoat,
		[dbo].[UsUserPermission].XuatDuLieu = tb.XuatDuLieu,
		[dbo].[UsUserPermission].Khac = tb.Khac,
		[dbo].[UsUserPermission].UpdatedAt = GETDATE(),
		[dbo].[UsUserPermission].UpdatedBy = tb.UpdatedBy
	FROM [dbo].[UsUserPermission] INNER JOIN @PermissionTable AS tb
	ON [dbo].[UsUserPermission].UserId = tb.UserId AND [dbo].[UsUserPermission].MenuId = tb.MenuId
    WHERE [dbo].[UsUserPermission].MenuId = tb.MenuId
END
GO

CREATE PROCEDURE [dbo].[SpR_UserPermission] 
	@UserId NVARCHAR(8)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @CountA INT, @CountB INT;

	SET @CountA = (SELECT COUNT(*) FROM [dbo].[UsUserPermission] WHERE UserId = @UserId)
	SET @CountB = (SELECT COUNT(*) FROM [dbo].[SysMenu])
	
	IF(@CountA != @CountB)
	BEGIN
		DELETE [dbo].[UsUserPermission] WHERE UserId = @UserId
		
        -- Nếu là Admin (00100001) thì full quyền, ngược lại thì không có quyền
        IF(@UserId != '00100001')
			INSERT INTO [dbo].[UsUserPermission](UserId, MenuId, Xem, Them, Sua, Xoa, SuaHangLoat, XoaHangLoat, XuatDuLieu, Khac, UpdatedAt, UpdatedBy)
			SELECT @UserId, Name, 0, 0, 0, 0, 0, 0, 0, 0, GETDATE(), '' FROM SysMenu
		ELSE
			INSERT INTO [dbo].[UsUserPermission](UserId, MenuId, Xem, Them, Sua, Xoa, SuaHangLoat, XoaHangLoat, XuatDuLieu, Khac, UpdatedAt, UpdatedBy)
			SELECT @UserId, Name, 1, 1, 1, 1, 1, 1, 1, 1, GETDATE(), '' FROM SysMenu
	END

	SELECT * FROM [dbo].[UsUserPermission] WHERE UserId = @UserId
END
GO