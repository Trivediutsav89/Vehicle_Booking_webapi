using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Vehicle_Booking.Models;

namespace Vehicle_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class PaymentController : ControllerBase
    {
        private readonly VehicleBookingContext context;

        public PaymentController(VehicleBookingContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Payment>>> GetAllPayments()
        {
            // Users can only see payments for their own bookings, admins can see all
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var query = context.Payments
                .Include(p => p.Booking)
                    .ThenInclude(b => b.Vehicle)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.User)
                .AsQueryable();

            if (currentUserRole != "Admin")
            {
                query = query.Where(p => p.Booking.UserId == currentUserId);
            }

            var data = await query.ToListAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPaymentById(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var payment = await context.Payments
                .Include(p => p.Booking)
                    .ThenInclude(b => b.Vehicle)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.User)
                .FirstOrDefaultAsync(p => p.PaymentId == id);

            if (payment == null)
            {
                return NotFound();
            }

            // Users can only view payments for their own bookings, admins can view any
            if (payment.Booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            return Ok(payment);
        }

        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment(PaymentDto dto)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            // Check if the booking belongs to the current user (unless admin)
            var booking = await context.Bookings.FindAsync(dto.BookingId);
            if (booking == null)
            {
                return BadRequest(new { message = "Invalid booking ID" });
            }

            if (booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            var payment = new Payment
            {
                BookingId = dto.BookingId,
                Amount = dto.Amount,
                PaymentDate = dto.PaymentDate,
                Status = dto.Status
            };
            await context.Payments.AddAsync(payment);
            await context.SaveChangesAsync();
            return Ok(payment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, PaymentDto dto)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var payment = await context.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.PaymentId == id);

            if (payment == null)
            {
                return NotFound();
            }

            // Users can only update payments for their own bookings, admins can update any
            if (payment.Booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            // Check if the new booking ID belongs to the current user (unless admin)
            var newBooking = await context.Bookings.FindAsync(dto.BookingId);
            if (newBooking == null)
            {
                return BadRequest(new { message = "Invalid booking ID" });
            }

            if (newBooking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            payment.BookingId = dto.BookingId;
            payment.Amount = dto.Amount;
            payment.PaymentDate = dto.PaymentDate;
            payment.Status = dto.Status;
            context.Entry(payment).State = EntityState.Modified;
            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!context.Payments.Any(e => e.PaymentId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(payment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePayment(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var payment = await context.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.PaymentId == id);

            if (payment == null)
            {
                return NotFound();
            }

            // Users can only delete payments for their own bookings, admins can delete any
            if (payment.Booking.UserId != currentUserId && currentUserRole != "Admin")
            {
                return Forbid();
            }

            context.Payments.Remove(payment);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
