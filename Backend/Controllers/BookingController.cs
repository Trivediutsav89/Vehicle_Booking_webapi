using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Vehicle_Booking.Models;

namespace Vehicle_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class BookingController : ControllerBase
    {
        private readonly VehicleBookingContext context;

        public BookingController(VehicleBookingContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Booking>>> GetAllBookings()
        {
            // Users can only see their own bookings, admins can see all
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var query = context.Bookings
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .Include(b => b.Payments)
                .AsQueryable();

            if (currentUserRole != "Admin")
            {
                query = query.Where(b => b.UserId == currentUserId);
            }

            var data = await query.ToListAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBookingById(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var booking = await context.Bookings
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .Include(b => b.Payments)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
            {
                return NotFound();
            }

            // Users can only view their own bookings, admins can view any
            if (booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            return Ok(booking);
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(BookingDto dto)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            // Users can only create bookings for themselves, admins can create for anyone
            if (dto.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            var booking = new Booking
            {
                UserId = dto.UserId,
                VehicleId = dto.VehicleId,
                FromDateTime = dto.FromDateTime,
                ToDateTime = dto.ToDateTime,
                Status = dto.Status
            };
            await context.Bookings.AddAsync(booking);
            await context.SaveChangesAsync();
            return Ok(booking);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Booking>> UpdateBooking(int id, BookingDto dto)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var booking = await context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Users can only update their own bookings, admins can update any
            if (booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            // Users can only update their own bookings, admins can update for anyone
            if (dto.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            booking.UserId = dto.UserId;
            booking.VehicleId = dto.VehicleId;
            booking.FromDateTime = dto.FromDateTime;
            booking.ToDateTime = dto.ToDateTime;
            booking.Status = dto.Status;
            context.Entry(booking).State = EntityState.Modified;
            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!context.Bookings.Any(e => e.BookingId == id))
                {
                    return NotFound();
                }
                throw;
            }
            return Ok(booking);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBooking(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var booking = await context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Users can only delete their own bookings, admins can delete any
            if (booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            // Check if booking has any payments
            var hasPayments = await context.Payments.AnyAsync(p => p.BookingId == id);
            if (hasPayments)
            {
                return BadRequest(new { message = "Cannot delete booking with existing payments. Please delete the payments first." });
            }

            context.Bookings.Remove(booking);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
