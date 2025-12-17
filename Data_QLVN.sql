USE [IDI_QLVN]
GO


BEGIN TRY
    BEGIN TRANSACTION

    /* =====================================================
       1. TẠO GROUP ADMIN (ID = 001)
       ===================================================== */
    IF NOT EXISTS (SELECT 1 FROM dbo.UsGroup WHERE Id = '001')
    BEGIN
        INSERT INTO dbo.UsGroup
        (
            Id,
            Name,
            Note,
            RowStatus,
            CreatedAt,
            CreatedBy,
            UpdatedAt,
            UpdatedBy
        )
        VALUES
        (
            '001',
            N'ADMIN',
            N'Nhóm quản trị hệ thống',
            1,
            GETDATE(),
            '00100001',
            GETDATE(),
            '00100001'
        )
    END


    /* =====================================================
       2. TẠO USER ADMIN (ID = 00100001)
       ===================================================== */
    IF NOT EXISTS (SELECT 1 FROM dbo.UsUser WHERE Id = '00100001')
    BEGIN
        INSERT INTO dbo.UsUser
        (
            Id,
            GroupId,
            Name,
            Gender,
            UserName,
            Password,
            Email,
            Phone,
            CMND,
            Address,
            Image,
            Note,
            RowStatus,
            CreatedAt,
            CreatedBy,
            UpdatedAt,
            UpdatedBy
        )
        VALUES
        (
            '00100001',
            '001',
            N'Administrator',
            1,
            'admin',
            '$2a$12$5qUH/3dHxXGNO8YjvLsrseJL/6.kGkOKFZZ6MCiskGYOhrGupO8EG',
            NULL,
            NULL,
            NULL,
            NULL,
            NULL,
            N'Tài khoản quản trị hệ thống (System Admin)',
            1,
            GETDATE(),
            '00100001',
            GETDATE(),
            '00100001'
        )
    END


    /* =====================================================
       3. KHỞI TẠO FULL QUYỀN MENU CHO ADMIN
       ===================================================== */
    -- Xoá quyền cũ (nếu có)
    DELETE FROM dbo.UsUserPermission
    WHERE UserId = '00100001'

    -- Gán full quyền tất cả menu
    INSERT INTO dbo.UsUserPermission
    (
        UserId,
        MenuId,
        Xem,
        Them,
        Sua,
        SuaHangLoat,
        Xoa,
        XoaHangLoat,
        XuatDuLieu,
        Khac,
        UpdatedAt,
        UpdatedBy
    )
    SELECT
        '00100001',
        Name,
        1, 1, 1, 1, 1, 1, 1, 1,
        GETDATE(),
        '00100001'
    FROM dbo.SysMenu


    /* =====================================================
       4. COMMIT
       ===================================================== */
    COMMIT TRANSACTION
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION

    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE()
    DECLARE @ErrSeverity INT = ERROR_SEVERITY()

    RAISERROR(@ErrMsg, @ErrSeverity, 1)
END CATCH
GO
