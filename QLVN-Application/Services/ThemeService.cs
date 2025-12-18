
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
        public async Task<ThemeSettings> GetThemeSettingsAsync(string userId)
        {
            var config = await _unitOfWork.Repository<UsUserConfig>().GetByIdAsync(userId);

            if (config == null || string.IsNullOrEmpty(config.Settings))
            {
                // Nếu chưa có cấu hình, trả về mặc định (theo class bạn định nghĩa)
                return new ThemeSettings();
            }

            try
            {
                // Deserialize JSON từ DB ra Object
                return JsonSerializer.Deserialize<ThemeSettings>(config.Settings) ?? new ThemeSettings();
            }
            catch
            {
                return new ThemeSettings();
            }
        }

        public async Task SaveThemeSettingsAsync(string userId,ThemeSettings settings)
        {
            var repo = _unitOfWork.Repository<UsUserConfig>();
            var config = await repo.GetByIdAsync(userId);

            // Chuyển Object C# thành chuỗi JSON để lưu DB
            var jsonString = JsonSerializer.Serialize(settings);

            if (config ==null || string.IsNullOrEmpty(config.Settings))
            {
                config = new UsUserConfig
                {
                    UserId = userId,
                    Settings = jsonString,
                    UpdatedAt = DateTime.Now
                };
                await repo.AddAsync(config);
            }
            else
            {
                config.Settings = jsonString;
                config.UpdatedAt = DateTime.Now;
                repo.Update(config);
            }
            await _unitOfWork.SaveChangesAsync();
        }

       
        //public async Task ResetThemeSettingsAsync(string userId)
        //{
        //    var repo = _unitOfWork.Repository<UsUserConfig>();
        //    var config = await repo.GetByIdAsync(userId);
        //    if (config != null)
        //    {
        //        repo.Delete(config);
        //        await _unitOfWork.SaveChangesAsync();
        //    }
        //}
    }

    
}
