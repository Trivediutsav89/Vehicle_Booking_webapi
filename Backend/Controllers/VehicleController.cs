using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Vehicle_Booking.Models;

namespace Vehicle_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class VehicleController : ControllerBase
    {
        private readonly VehicleBookingContext context;

        public VehicleController(VehicleBookingContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Vehicle>>> GetAllVehicles()
        {
            var data = await context.Vehicles.ToListAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicleById(int id)
        {
            var vehicle = await context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }
            return Ok(vehicle);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Only admins can create vehicles
        public async Task<ActionResult<Vehicle>> CreateVehicle(VehicleDto dto)
        {
            var vehicle = new Vehicle
            {
                VehicleNumber = dto.VehicleNumber,
                Type = dto.Type,
                Model = dto.Model,
                Capacity = dto.Capacity,
                RatePerKM = dto.RatePerKM,
                IsAvailable = dto.IsAvailable,
                ImageUrl = dto.ImageUrl
            };
            await context.Vehicles.AddAsync(vehicle);
            await context.SaveChangesAsync();
            return Ok(vehicle);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can update vehicles
        public async Task<ActionResult<Vehicle>> UpdateVehicle(int id, VehicleDto dto)
        {
            var vehicle = await context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }
            vehicle.VehicleNumber = dto.VehicleNumber;
            vehicle.Type = dto.Type;
            vehicle.Model = dto.Model;
            vehicle.Capacity = dto.Capacity;
            vehicle.RatePerKM = dto.RatePerKM;
            vehicle.IsAvailable = dto.IsAvailable;
            vehicle.ImageUrl = dto.ImageUrl;
            context.Entry(vehicle).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(vehicle);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can delete vehicles
        public async Task<ActionResult> DeleteVehicle(int id)
        {
            var v = await context.Vehicles.FindAsync(id);
            if (v == null)
            {
                return NotFound();
            }

            // Check if vehicle has any bookings
            var hasBookings = await context.Bookings.AnyAsync(b => b.VehicleId == id);
            if (hasBookings)
            {
                return BadRequest(new { message = "Cannot delete vehicle with existing bookings. Please delete the bookings first." });
            }

            // Check if vehicle is assigned to a driver
            var hasDriver = await context.Drivers.AnyAsync(d => d.AssignedVehicleId == id);
            if (hasDriver)
            {
                return BadRequest(new { message = "Cannot delete vehicle assigned to a driver. Please unassign the driver first." });
            }

            context.Vehicles.Remove(v);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<ActionResult<List<Vehicle>>> FilterVehicles([FromQuery] string? type, [FromQuery] bool? isAvailable, [FromQuery] int? minCapacity)
        {
            var query = context.Vehicles.AsQueryable();

            if (!string.IsNullOrEmpty(type))
                query = query.Where(v => v.Type == type);

            if (isAvailable.HasValue)
                query = query.Where(v => v.IsAvailable == isAvailable);

            if (minCapacity.HasValue)
                query = query.Where(v => v.Capacity >= minCapacity);

            var result = await query.ToListAsync();
            return Ok(result);
        }

        [HttpGet("dropdown/types")]
        public async Task<ActionResult<List<string>>> GetVehicleTypes()
        {
            var types = await context.Vehicles
                .Select(v => v.Type)
                .Distinct()
                .ToListAsync();

            return Ok(types);
        }
    }
}