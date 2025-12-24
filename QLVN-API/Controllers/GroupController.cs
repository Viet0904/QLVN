using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLVN_Application.Interfaces;

namespace QLVN_API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class GroupController : ControllerBase
{
    private readonly IGroupService _groupService;

    public GroupController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _groupService.GetAllAsync());
    }
}