
using QLVN_Application.Interfaces;
using QLVN_Domain.Interfaces;
using System.Text.Json;
using QLVN_Contracts.Dtos.Theme;
using QLVN_Domain.Entities;
namespace QLVN_Application.Services
{
    public class ThemeService : IThemeService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ThemeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Lấy Theme của user theo userId
        public async Task<ThemeSettings> GetThemeAsync(string userId)
        {
            var config = await _unitOfWork.Repository<UsUserConfig>().GetByIdAsync(userId);

            // nếu UserSetting không tồn tại hoặc Setting rỗng thì trả về mặc định
            if (config == null || string.IsNullOrEmpty(config.Settings))
            {
                return new ThemeSettings(); // Trả về mặc định
            }
            // Chuyển chuỗi JSON trong DB thành Object C#
            return JsonSerializer.Deserialize<ThemeSettings>(config.Settings);
        }

        public async Task SaveThemeAsync(string userId,ThemeSettings settings)
        {
            var repo = _unitOfWork.Repository<UsUserConfig>();
            var config = await repo.GetByIdAsync(userId);
        }
    }

    
}
