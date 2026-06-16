using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Vehicle_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public ActionResult<string> GetPublic()
        {
            return Ok("This is a public endpoint - no authentication required");
        }

        [HttpGet("protected")]
        [Authorize]
        public ActionResult<string> GetProtected()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "This is a protected endpoint - authentication required",
                userId = userId,
                userEmail = userEmail,
                userRole = userRole
            });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public ActionResult<string> GetAdminOnly()
        {
            return Ok("This is an admin-only endpoint");
        }

        [HttpGet("user")]
        [Authorize(Roles = "User")]
        public ActionResult<string> GetUserOnly()
        {
            return Ok("This is a user-only endpoint");
        }
    }
} 