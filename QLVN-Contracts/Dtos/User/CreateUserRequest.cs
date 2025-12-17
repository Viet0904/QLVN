
using System.ComponentModel.DataAnnotations;


namespace QLVN_Contracts.Dtos.User
{
    public class CreateUserRequest
    {
        [Required]
        public string Id { get; set; }
        public string ?Name { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public string GroupId { get; set; }
        public string ?Email { get; set; }
        public string ?Phone { get; set; }
        public int RowStatus { get; set; }
    }
}
