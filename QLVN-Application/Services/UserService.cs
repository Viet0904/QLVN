using QLVN_Application.Interfaces;
using AutoMapper;
using QLVN_Contracts.Dtos.User;
using QLVN_Domain.Entities;
using QLVN_Domain.Interfaces;
using BCrypt.Net;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using QLVN_Contracts.Dtos.Auth;
using Microsoft.Extensions.Configuration; // Để đọc cấu hình JWT
namespace QLVN_Application.Services
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _config; // Inject Configuration để lấy Key
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration config)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _config = config;
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
        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // 1. Tìm user theo UserName
            // Lưu ý: Repository Generic  FindAsync hoặc dùng GetAll rồi Linq 
            var users = await _unitOfWork.Repository<UsUser>().GetAllAsync();
            var user = users.FirstOrDefault(x => x.UserName == request.UserName);

            if (user == null)
            {
                throw new Exception("Tài khoản không tồn tại");
            }

            // 2. Kiểm tra Password (Băm BCrypt)
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

            if (!isPasswordValid)
            {
                throw new Exception("Mật khẩu không chính xác");
            }

            // 3. Tạo JWT Token
            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                FullName = user.Name
            };
        }

        private string GenerateJwtToken(UsUser user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim("FullName", user.Name),
                new Claim("GroupId", user.GroupId) // Ví dụ dùng GroupId làm Role
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token hết hạn sau 1 giờ
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
