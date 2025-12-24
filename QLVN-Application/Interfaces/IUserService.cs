using QLVN_Contracts.Dtos.Auth;
using QLVN_Contracts.Dtos.User;

namespace QLVN_Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(string id);
        Task CreateAsync(CreateUserRequest request);
        Task UpdateAsync(string id, UpdateUserRequest request); 
        Task DeleteAsync(string id);

        // Hàm xử lý Login
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}