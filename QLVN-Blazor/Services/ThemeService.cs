using QLVN_Contracts.Dtos.Theme;
using System.Net.Http.Json;

namespace QLVN_Blazor.Services
{
    public class ThemeService
    {
        private readonly HttpClient _http;

        public ThemeService(HttpClient http)
        {
            _http = http;
        }

        public async Task<ThemeSettings> GetThemeAsync()
        {
            try
            {
                // Gọi API lấy config, nếu lỗi hoặc chưa có thì trả về mặc định
                var result = await _http.GetFromJsonAsync<ThemeSettings>("api/Theme");
                return result ?? new ThemeSettings();
            }
            catch
            {
                return new ThemeSettings();
            }
        }

        public async Task SaveThemeAsync(ThemeSettings settings)
        {
            await _http.PostAsJsonAsync("api/Theme", settings);
        }
    }
}