using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
