using QLVN_Contracts.Dtos.Auth;
using QLVN_Contracts.Dtos.User;

namespace QLVN_Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(string id);
        Task<UserDto> CreateAsync(CreateUserRequest request);
        Task<UserDto> UpdateAsync(string id, UpdateUserRequest request);
        Task DeleteAsync(string id);
        Task<LoginResponse> LoginAsync(LoginRequest request);
    }
}