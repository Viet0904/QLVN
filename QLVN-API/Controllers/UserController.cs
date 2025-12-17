using Microsoft.AspNetCore.Mvc;
using QLVN_Application.Interfaces;
using QLVN_Contracts.Dtos.User;
namespace QLVN_API.Controllers
{
    public class UserController : Controller
    {
        [Route("api/[controller]")]
        [ApiController]
        private readonly IUserService _userService;
        public UserController(IUserService uservice)
        {
            _userService = uservice;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _userService.GetAllAsync();
            return Ok(result);
        }
        [HttpPost]

        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            await _userService.CreateAsync(request);
            return StatusCode(201, "Tạo thành công");

        }
    }
}
