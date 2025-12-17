// QLVN-Contracts/Dtos/Dvsd/CreateDvsdRequest.cs
using System.ComponentModel.DataAnnotations;

namespace QLVN_Contracts.Dtos.Dvsd
{
    public class CreateDvsdRequest
    {
        [Required(ErrorMessage = "Mã không được để trống")]
        [MaxLength(5)]
        public string Ma { get; set; } = null!;

        [Required(ErrorMessage = "Tên không được để trống")]
        public string Ten { get; set; } = null!;
        public string? DiaChi { get; set; }
        
    }
}