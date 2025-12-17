using QLVN_Application.Interfaces;
using AutoMapper;
using QLVN_Contracts.Dtos.User;
using QLVN_Domain.Entities;
using QLVN_Domain.Interfaces;
using BCrypt.Net;
namespace QLVN_Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            // Gọi Repository lấy Entity
            var users = await _unitOfWork.Repository<UsUser>().GetAllAsync();

            // Map Entity sang DTO
            return _mapper.Map<IEnumerable<UserDto>>(users);

        }
        public async Task<UserDto?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }
        public async Task CreateAsync(CreateUserRequest request)
        {
            var userEntity = _mapper.Map<UsUser>(request);
            userEntity.CreatedAt = DateTime.UtcNow;
            userEntity.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            userEntity.CreatedBy = "00100001";


            await _unitOfWork.Repository<UsUser>().AddAsync(userEntity);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task UpdateAsync(string id, UpdateUserRequest request)
        {
            throw new NotImplementedException();
        }
        public async Task DeleteAsync(string id) {
            throw new NotImplementedException();
        }

        
    }
}
