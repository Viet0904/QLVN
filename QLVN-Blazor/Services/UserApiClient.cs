using QLVN_Contracts.Dtos.User;
using System.Net.Http.Json;

namespace QLVN_Blazor.Services
{
    public class UserApiClient
    {
        private readonly HttpClient _httpClient;
        public UserApiClient(HttpClient httpClient) => _httpClient = httpClient;

        public async Task<List<UserDto>> GetUserAllSync()
            => await _httpClient.GetFromJsonAsync<List<UserDto>>("api/User") ?? new();

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