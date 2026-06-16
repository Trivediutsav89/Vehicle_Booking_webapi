using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Vehicle_Booking.Models;

namespace Vehicle_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all endpoints
    public class DriverController : ControllerBase
    {
        private readonly VehicleBookingContext context;

        public DriverController(VehicleBookingContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Driver>>> GetAllDrivers()
        {
            var data = await context.Drivers.ToListAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriverById(int id)
        {
            var driver = await context.Drivers.FindAsync(id);
            if (driver == null)
            {
                return NotFound();
            }
            return Ok(driver);
        }

        // Add DTOs for Driver
        public class DriverCreateDto
        {
            public string Name { get; set; } = null!;
            public string Phone { get; set; } = null!;
            public int? AssignedVehicleId { get; set; }
            public bool IsActive { get; set; }
        }

        public class DriverUpdateDto
        {
            public string Name { get; set; } = null!;
            public string Phone { get; set; } = null!;
            public int? AssignedVehicleId { get; set; }
            public bool IsActive { get; set; }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Only admins can create drivers
        public async Task<ActionResult<Driver>> CreateDriver(DriverDto dto)
        {
            var driver = new Driver
            {
                Name = dto.Name,
                Phone = dto.Phone,
                AssignedVehicleId = dto.AssignedVehicleId,
                IsActive = dto.IsActive
            };
            await context.Drivers.AddAsync(driver);
            await context.SaveChangesAsync();
            return Ok(driver);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can update drivers
        public async Task<ActionResult<Driver>> UpdateDriver(int id, DriverDto dto)
        {
            var driver = await context.Drivers.FindAsync(id);
            if (driver == null)
            {
                return NotFound();
            }
            driver.Name = dto.Name;
            driver.Phone = dto.Phone;
            driver.AssignedVehicleId = dto.AssignedVehicleId;
            driver.IsActive = dto.IsActive;
            context.Entry(driver).State = EntityState.Modified;
            await context.SaveChangesAsync();
            return Ok(driver);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can delete drivers
        public async Task<ActionResult> DeleteDriver(int id)
        {
            var d = await context.Drivers.FindAsync(id);
            if (d == null)
            {
                return NotFound();
            }

            // Check if driver is assigned to a vehicle
            if (d.AssignedVehicleId.HasValue)
            {
                return BadRequest(new { message = "Cannot delete driver assigned to a vehicle. Please unassign the vehicle first." });
            }

            context.Drivers.Remove(d);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<ActionResult<List<Driver>>> FilterDrivers([FromQuery] bool? isActive, [FromQuery] bool? hasVehicle)
        {
            var query = context.Drivers.AsQueryable();

            if (isActive.HasValue)
                query = query.Where(d => d.IsActive == isActive);

            if (hasVehicle.HasValue)
            {
                if (hasVehicle.Value)
                    query = query.Where(d => d.AssignedVehicleId != null);
                else
                    query = query.Where(d => d.AssignedVehicleId == null);
            }

            return Ok(await query.ToListAsync());
        }

        [HttpGet("dropdown/active")]
        public async Task<ActionResult<List<Driver>>> GetActiveDrivers()
        {
            var drivers = await context.Drivers
                .Where(d => d.IsActive)
                .ToListAsync();

            return Ok(drivers);
        }
    }
}
