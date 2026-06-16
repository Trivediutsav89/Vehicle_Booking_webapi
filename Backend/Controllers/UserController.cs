using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Vehicle_Booking.Models;

namespace Vehicle_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class UserController : ControllerBase
    {
        private readonly VehicleBookingContext context;

        public UserController(VehicleBookingContext context)
        {
            this.context = context;
        }

        // GET: api/User
        [HttpGet]
        [Authorize(Roles = "Admin")] // Only admins can view all users
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            var users = await context.Users.ToListAsync();
            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            // Users can only view their own profile, admins can view any
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (currentUserId != id && currentUserRole != "Admin")
            {
                return Forbid();
            }

            var user = await context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only admins can create users
        public async Task<ActionResult<User>> CreateUser(UserDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash,
                Role = dto.Role,
                IsActive = dto.IsActive
            };
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return Ok(user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUser(int id, UserDto dto)
        {
            // Users can only update their own profile, admins can update any
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (currentUserId != id && currentUserRole != "Admin")
            {
                return Forbid();
            }

            var user = await context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            user.Name = dto.Name;
            user.Email = dto.Email;
            user.PasswordHash = dto.PasswordHash;
            user.Role = dto.Role;
            user.IsActive = dto.IsActive;
            context.Entry(user).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(user);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can delete users
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            // Check if user has any bookings
            var hasBookings = await context.Bookings.AnyAsync(b => b.UserId == id);
            if (hasBookings)
            {
                return BadRequest(new { message = "Cannot delete user with existing bookings. Please delete the bookings first." });
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
