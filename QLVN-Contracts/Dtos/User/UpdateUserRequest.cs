
using System.ComponentModel.DataAnnotations;


namespace QLVN_Contracts.Dtos.User
{
    public class UpdateUserRequest
    {
        [Required]
        public string? Id { get; set; }
        public string? GroupId { get; set; }
        public string Gender { get; set; }
        public string? Name { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? CMND { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Note { get; set; }
        public string? Image { get; set; }
        public int? RowStatus { get; set; }
    }
}
