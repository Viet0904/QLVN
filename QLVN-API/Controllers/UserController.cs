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
        public async Task<IActionResult> GetById(string id) => Ok(await _userService.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            await _userService.CreateAsync(request);
            return StatusCode(201);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserRequest request)
        {
            await _userService.UpdateAsync(id, request);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}