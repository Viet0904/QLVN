using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Authorization;
using QLVN_Contracts.Dtos.Auth;
using System.Net.Http.Json;

namespace QLVN_Blazor.Services
{
    public class AuthService
    {
        private readonly HttpClient _httpClient;
        private readonly ILocalStorageService _localStorage;
        private readonly AuthenticationStateProvider _authStateProvider;

        public AuthService(HttpClient httpClient, ILocalStorageService localStorage, AuthenticationStateProvider authStateProvider)
        {
            _httpClient = httpClient;
            _localStorage = localStorage;
            _authStateProvider = authStateProvider;
        }

        public async Task<LoginResponse> Login(LoginRequest loginRequest)
        {
            var response = await _httpClient.PostAsJsonAsync("api/Auth/login", loginRequest);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                // Lưu token vào LocalStorage
                await _localStorage.SetItemAsync("authToken", result!.Token);

                // Báo cho Blazor biết đã đăng nhập (Cần ép kiểu về CustomAuthProvider ở bước dưới)
                ((CustomAuthStateProvider)_authStateProvider).MarkUserAsAuthenticated(result.Token);

                return result;
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception(error); // Hoặc xử lý lỗi đẹp hơn
            }
        }

        public async Task Logout()
        {
            await _localStorage.RemoveItemAsync("authToken");
            ((CustomAuthStateProvider)_authStateProvider).MarkUserAsLoggedOut();
        }
    }
}