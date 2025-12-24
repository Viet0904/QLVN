using Microsoft.AspNetCore.Mvc;
using QLVN_Application.Interfaces;
using QLVN_Contracts.Dtos.User;
using Microsoft.AspNetCore.Authorization;

namespace QLVN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService uservice) => _userService = uservice;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _userService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { message = $"Không tìm thấy người dùng với ID: {id}" });
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            try
            {
                var newUser = await _userService.CreateAsync(request);
                return StatusCode(201, newUser);
            }
            catch (InvalidOperationException ex)
            {
                // Trả về BadRequest với message cụ thể
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Lỗi không mong đợi
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tạo người dùng." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserRequest request)
        {
            var updatedUser = await _userService.UpdateAsync(id, request);
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}