-- =============================================
-- Create date: 2025-12-23
-- Description: Script seeding Group 'User' và 50 Users (từ ID 00100002)
-- =============================================

USE [IDI_QLVN]
GO

BEGIN TRANSACTION;

BEGIN TRY
    -- 1. TẠO GROUP 'USER' (ID: 002)
    IF NOT EXISTS (SELECT 1 FROM [dbo].[UsGroup] WHERE [Id] = N'002')
    BEGIN
        INSERT INTO [dbo].[UsGroup] ([Id], [Name], [Note], [RowStatus], [CreatedAt], [CreatedBy], [UpdatedAt], [UpdatedBy])
        VALUES (N'002', N'User', N'Nhóm người dùng hệ thống', 1, GETDATE(), N'00100001', GETDATE(), N'00100001');
        
        PRINT 'Đã tạo Group 002 - User.';
    END
    ELSE
    BEGIN
        PRINT 'Group 002 đã tồn tại.';
    END

    -- 2. KHAI BÁO CÁC BIẾN CẤU HÌNH
    DECLARE @DefaultPassword NVARCHAR(200) = N'$2a$12$YjW28Nuh4GML75pNEnflseKqz.m82UQmRIM/XyTFdGSy0PhyeneHa';
    DECLARE @StartNumber INT = 2; -- Bắt đầu từ 2 để ra ID 00100002
    DECLARE @TotalUsers INT = 50;

    -- 3. DÙNG CTE ĐỂ SINH 50 RECORDS
    WITH UserSequence AS (
        SELECT TOP (@TotalUsers) 
            ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) + @StartNumber - 1 AS Seq
        FROM sys.objects a CROSS JOIN sys.objects b
    )
    INSERT INTO [dbo].[UsUser] (
        [Id], 
        [GroupId], 
        [Name], 
        [Gender], 
        [UserName], 
        [Password], 
        [Email], 
        [Phone], 
        [CMND], 
        [Address], 
        [Image], 
        [Note], 
        [RowStatus], 
        [CreatedAt], 
        [CreatedBy], 
        [UpdatedAt], 
        [UpdatedBy]
    )
    SELECT 
        -- Id format: 00100002, 00100003... (nvarchar(8))
        RIGHT('00100000' + CAST(Seq AS NVARCHAR(10)), 8) AS [Id],
        
        -- GroupId: Gán vào nhóm 002 vừa tạo
        N'002' AS [GroupId],
        
        -- Name: Họ tên mẫu theo danh sách thực tế
        CASE (Seq % 10)
            WHEN 0 THEN N'Nguyễn Văn An ' + CAST(Seq AS NVARCHAR(3))
            WHEN 1 THEN N'Trần Thị Bình ' + CAST(Seq AS NVARCHAR(3))
            WHEN 2 THEN N'Lê Minh Cường ' + CAST(Seq AS NVARCHAR(3))
            WHEN 3 THEN N'Phạm Hoàng Dũng ' + CAST(Seq AS NVARCHAR(3))
            WHEN 4 THEN N'Hoàng Anh Tuấn ' + CAST(Seq AS NVARCHAR(3))
            WHEN 5 THEN N'Vũ Đức Thịnh ' + CAST(Seq AS NVARCHAR(3))
            WHEN 6 THEN N'Đặng Thu Thảo ' + CAST(Seq AS NVARCHAR(3))
            WHEN 7 THEN N'Bùi Quang Huy ' + CAST(Seq AS NVARCHAR(3))
            WHEN 8 THEN N'Đỗ Phương Nam ' + CAST(Seq AS NVARCHAR(3))
            ELSE N'Ngô Gia Bảo ' + CAST(Seq AS NVARCHAR(3))
        END AS [Name],
        
        -- Gender: 1: Nam, 0: Nữ
        CASE WHEN Seq % 2 = 0 THEN 1 ELSE 0 END AS [Gender],
        
        -- UserName: user02, user03... (Giới hạn nvarchar(10))
        LOWER('u' + RIGHT('000' + CAST(Seq AS NVARCHAR(5)), 5)) AS [UserName],
        
        -- Password
        @DefaultPassword AS [Password],
        
        -- Email: user02@idi.com.vn (nvarchar(30))
        LOWER('u' + CAST(Seq AS NVARCHAR(5)) + '@idi.com.vn') AS [Email],
        
        -- Phone
        '091' + RIGHT('0000000' + CAST(Seq * 1234567 AS VARCHAR(20)), 7) AS [Phone],
        
        -- CMND
        '089' + RIGHT('000000000' + CAST(Seq * 999999 AS VARCHAR(20)), 9) AS [CMND],
        
        -- Address
        N'Khu vực nuôi số ' + CAST(Seq AS NVARCHAR(3)) + N', An Giang' AS [Address],
        
        -- Image
        NULL AS [Image],
        
        -- Note
        N'Auto-generated User ' + CAST(Seq AS NVARCHAR(3)) AS [Note],
        
        -- Status & Timestamps
        1 AS [RowStatus],
        GETDATE() AS [CreatedAt],
        N'00100001' AS [CreatedBy],
        GETDATE() AS [UpdatedAt],
        N'00100001' AS [UpdatedBy]
    FROM UserSequence;

    COMMIT TRANSACTION;
    PRINT 'Đã chèn thành công 50 users từ ID 00100002 đến 00100051.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    PRINT 'LỖI: ' + ERROR_MESSAGE();
END CATCH
GO