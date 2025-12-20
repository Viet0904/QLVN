using QLVN_Application.Interfaces;
using AutoMapper;
using QLVN_Contracts.Dtos.User;
using QLVN_Domain.Entities;
using QLVN_Domain.Interfaces;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using QLVN_Contracts.Dtos.Auth;
using Microsoft.Extensions.Configuration;

namespace QLVN_Application.Services
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _config;
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
            var users = await _unitOfWork.Repository<UsUser>().GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> GetByIdAsync(string id)
        {
            var user = await _unitOfWork.Repository<UsUser>().GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task CreateAsync(CreateUserRequest request)
        {
            var userEntity = _mapper.Map<UsUser>(request);
            userEntity.Id = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
            userEntity.CreatedAt = DateTime.Now;
            userEntity.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            userEntity.CreatedBy = "SYSTEM";
            userEntity.UpdatedAt = DateTime.Now; // Khởi tạo UpdatedAt
            userEntity.UpdatedBy = "SYSTEM";
            userEntity.RowStatus = 1;

            await _unitOfWork.Repository<UsUser>().AddAsync(userEntity);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(string id, UpdateUserRequest request)
        {
            var user = await _unitOfWork.Repository<UsUser>().GetByIdAsync(id);
            if (user == null) throw new Exception("Không tìm thấy người dùng");

            // Xử lý cảnh báo CS8601: Kiểm tra null trước khi gán cho thuộc tính không được null
            user.Name = request.Name ?? user.Name;
            user.GroupId = request.GroupId ?? user.GroupId;
            user.Email = request.Email;
            user.Phone = request.Phone;
            user.Address = request.Address;
            user.Cmnd = request.CMND;
            user.Note = request.Note;
            user.Image = request.Image;

            // Xử lý lỗi CS0266: Ép kiểu hoặc cung cấp giá trị mặc định cho int? -> int
            user.RowStatus = request.RowStatus ?? user.RowStatus;

            // Chuyển đổi Gender từ string (DTO) sang int? (Entity)
            if (int.TryParse(request.Gender, out int genderVal))
            {
                user.Gender = genderVal;
            }

            user.UpdatedAt = DateTime.Now;
            user.UpdatedBy = "SYSTEM"; // Nên lấy từ Claims của User hiện tại

            _unitOfWork.Repository<UsUser>().Update(user);
            await _unitOfWork.SaveChangesAsync(); // Thêm await để sửa cảnh báo CS1998
        }

        public async Task DeleteAsync(string id)
        {
            var user = await _unitOfWork.Repository<UsUser>().GetByIdAsync(id);
            if (user != null)
            {
                _unitOfWork.Repository<UsUser>().Delete(user);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var users = await _unitOfWork.Repository<UsUser>().GetAllAsync();
            var user = users.FirstOrDefault(x => x.UserName == request.UserName);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new Exception("Tài khoản hoặc mật khẩu không chính xác");
            }

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
                new Claim("GroupId", user.GroupId)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
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