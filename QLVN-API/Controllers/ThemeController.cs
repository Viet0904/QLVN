using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLVN_Application.Interfaces;
using QLVN_Contracts.Dtos.Theme;

namespace QLVN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // bắt buộc đăng nhập
    public class ThemeController : Controller
    {
        private readonly IThemeService _themeService;

        public ThemeController(IThemeService themeService)
        {
            _themeService = themeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTheme()
        {
            // Lấy UserId từ Token JWT
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var settings = await _themeService.GetThemeSettingsAsync(userId);
            return Ok(settings);
        }

        [HttpPost]
        public async Task<IActionResult> SaveTheme([FromBody] ThemeSettings settings)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            await _themeService.SaveThemeSettingsAsync(userId, settings);
            return Ok();
        }
    }
}
