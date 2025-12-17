using QLVN_Contracts.Dtos.User;
using System.Net.Http.Json;

namespace QLVN_Blazor.Services
{
    public class UserApiClient
    {
        private readonly HttpClient _httpClient;

        public UserApiClient(HttpClient htppClient)
        {
            _httpClient = htppClient;
        }
        public async Task<List<UserDto>> GetUserAllSync()
        {
            return await _httpClient.GetFromJsonAsync<List<UserDto>>("api/User");
        }
    }
}
