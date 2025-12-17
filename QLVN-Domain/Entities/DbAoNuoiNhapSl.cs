using System;
using System.Collections.Generic;

namespace QLVN_Infrastructure.Entities;

public partial class DbAoNuoiNhapSl
{
    public string Ma { get; set; } = null!;

    public string AoNuoiMa { get; set; } = null!;

    public DateOnly NgayKiem { get; set; }

    public decimal LuongGiong { get; set; }

    public string? Note { get; set; }

    public int RowStatus { get; set; }

    public DateTime CreatedAt { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime UpdatedAt { get; set; }

    public string UpdatedBy { get; set; } = null!;
}
