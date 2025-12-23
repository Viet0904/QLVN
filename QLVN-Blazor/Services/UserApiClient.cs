using QLVN_Contracts.Dtos.User;
using System.Net.Http.Json;

namespace QLVN_Blazor.Services
{
    public class UserApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserApiClient> _logger; // Inject ILogger

        public UserApiClient(HttpClient httpClient, ILogger<UserApiClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _httpClient.Timeout = TimeSpan.FromSeconds(30); // Fix timeout nếu slow
            _httpClient.BaseAddress = new Uri("https://localhost:5084/"); // Đảm bảo đúng API port
        }

        public async Task<List<UserDto>> GetUserAllSync()
        {
            try
            {
                _logger.LogInformation("Fetching users from API...");
                var response = await _httpClient.GetFromJsonAsync<List<UserDto>>("api/User");
                _logger.LogInformation("Users fetched successfully.");
                return response ?? new();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error fetching users.");
                return new();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error fetching users.");
                return new();
            }
        }

        

        public async Task<UserDto?> GetByIdAsync(string id)
            => await _httpClient.GetFromJsonAsync<UserDto>($"api/User/{id}");

        public async Task<bool> CreateAsync(CreateUserRequest request)
        {
            var res = await _httpClient.PostAsJsonAsync("api/User", request);
            return res.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateAsync(string id, UpdateUserRequest request)
        {
            var res = await _httpClient.PutAsJsonAsync($"api/User/{id}", request);
            return res.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var res = await _httpClient.DeleteAsync($"api/User/{id}");
            return res.IsSuccessStatusCode;
        }
    }
}