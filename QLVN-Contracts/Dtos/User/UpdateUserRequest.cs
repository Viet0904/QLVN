
using System.ComponentModel.DataAnnotations;

namespace QLVN_Contracts.Dtos.User;

public class UpdateUserRequest
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int? Gender { get; set; }
    public string? Cmnd { get; set; }
    public string? Image { get; set; }
    public string? Address { get; set; }
    public string? Note { get; set; }
    public int RowStatus { get; set; } = 1;
}