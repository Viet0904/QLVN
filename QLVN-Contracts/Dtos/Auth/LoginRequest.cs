using System.ComponentModel.DataAnnotations;

namespace QLVN_Contracts.Dtos.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Tài khoản không được để trống")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]

        public string Password { get; set; } = null!;
    }
}
