using System.ComponentModel.DataAnnotations;

namespace QLVN_Domain.Entities
{
    public class UsUserConfig
    {
        [Key]
        [StringLength(8)] // Khớp với nvarchar(8) trong SQL
        public string UserId { get; set; }

        [Required]
        public string Settings { get; set; } // Chuỗi JSON lưu toàn bộ ThemeSettings

        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}