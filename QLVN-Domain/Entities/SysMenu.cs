using System;
using System.Collections.Generic;

namespace QLVN_Domain.Entities;

public partial class SysMenu
{
    public string Name { get; set; } = null!;

    public string? ParentMenu { get; set; }

    public string Note { get; set; } = null!;

    public int? IsActive { get; set; }

    public virtual ICollection<UsUserPermission> UsUserPermissions { get; set; } = new List<UsUserPermission>();
}
