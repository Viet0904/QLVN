using System;
using System.Collections.Generic;

namespace QLVN_Domain.Entities;

public partial class UsUser
{
    public string Id { get; set; } = null!;

    public string GroupId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int? Gender { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Cmnd { get; set; }

    public string? Address { get; set; }

    public string? Image { get; set; }

    public string? Note { get; set; }

    public int RowStatus { get; set; }

    public DateTime CreatedAt { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime UpdatedAt { get; set; }

    public string UpdatedBy { get; set; } = null!;

    public virtual ICollection<SysSetting> SysSettings { get; set; } = new List<SysSetting>();

    public virtual ICollection<SysSystemInfo> SysSystemInfos { get; set; } = new List<SysSystemInfo>();

    public virtual ICollection<UsGridLayout> UsGridLayouts { get; set; } = new List<UsGridLayout>();

    public virtual ICollection<UsUserLog> UsUserLogs { get; set; } = new List<UsUserLog>();

    public virtual ICollection<UsUserPermission> UsUserPermissions { get; set; } = new List<UsUserPermission>();
}
