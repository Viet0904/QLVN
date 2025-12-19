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
        private readonly NotificationService _notificationService;

        public AuthService(
            HttpClient httpClient,
            ILocalStorageService localStorage,
            AuthenticationStateProvider authStateProvider,
            NotificationService notificationService)
        {
            _httpClient = httpClient;
            _localStorage = localStorage;
            _authStateProvider = authStateProvider;
            _notificationService = notificationService;
        }

        public async Task<LoginResponse> Login(LoginRequest loginRequest)
        {
            var response = await _httpClient.PostAsJsonAsync("api/Auth/login", loginRequest);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                // Lưu token vào LocalStorage
                await _localStorage.SetItemAsync("authToken", result!.Token);

                // Thông Báo cho Blazor biết đã đăng nhập 
                ((CustomAuthStateProvider)_authStateProvider).MarkUserAsAuthenticated(result.Token);

                // Hiển thị notification chào mừng
                await _notificationService.ShowSuccessAsync(
                    $"Chào mừng {loginRequest.UserName}!",
                    "fa fa-smile-o");

                return result;
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                await _notificationService.ShowErrorAsync($"Đăng nhập thất bại: {error}");
                throw new Exception(error);
            }
        }

        public async Task Logout()
        {
            await _localStorage.RemoveItemAsync("authToken");
            ((CustomAuthStateProvider)_authStateProvider).MarkUserAsLoggedOut();
            await _notificationService.ShowInfoAsync("Đã đăng xuất thành công");
        }
    }
}