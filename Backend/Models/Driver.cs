using System;
using Newtonsoft.Json;

namespace Vehicle_Booking.Models
{
    public partial class Driver
    {
        public int DriverId { get; set; }

        public string Name { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public int? AssignedVehicleId { get; set; }

        public bool IsActive { get; set; }

        [JsonIgnore]
        public virtual Vehicle? AssignedVehicle { get; set; }
    }
}

public class DriverDto
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public int? AssignedVehicleId { get; set; }
    public bool IsActive { get; set; }
}
