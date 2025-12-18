using System.ComponentModel.DataAnnotations;

namespace QLVN_Domain.Entities
{
    public class UsUserConfig
    {
        [Key]
        public string UserId { get; set; } = null!;
        public string Settings { get; set; } = "{}"; // JSON string
        public DateTime UpdatedAt { get; set; }
        public DateTime CreateAt { get; set; }
    }
}