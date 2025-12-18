

using QLVN_Contracts.Dtos.Theme;

namespace QLVN_Application.Interfaces
{
    public interface IThemeService
    {
        // Lấy cấu hình theme của user hiện tại
        Task<ThemeSettings> GetThemeSettingsAsync(string userId);

        // Lưu cấu hình theme (nhận vào object ThemeSettings)
        Task SaveThemeSettingsAsync(string userId, ThemeSettings settings);

        // Reset về mặc định
        //Task ResetThemeSettingsAsync(string userId);
    }
}
