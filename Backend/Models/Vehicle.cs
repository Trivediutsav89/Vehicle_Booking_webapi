using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Vehicle_Booking.Models
{
    public partial class Vehicle
    {
        public int VehicleId { get; set; }

        public string VehicleNumber { get; set; } = null!;

        public string Type { get; set; } = null!;

        public string Model { get; set; } = null!;

        public int Capacity { get; set; }

        public decimal RatePerKM { get; set; }

        public bool IsAvailable { get; set; }

        public string? ImageUrl { get; set; }

        [JsonIgnore]
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

        [JsonIgnore]
        public virtual Driver? Driver { get; set; }
    }
}

public class VehicleCreateDto
{
    public string VehicleNumber { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Model { get; set; } = null!;
    public int Capacity { get; set; }
    public decimal RatePerKM { get; set; }
    public bool IsAvailable { get; set; }
    public string? ImageUrl { get; set; }
}

public class VehicleUpdateDto
{
    public string Type { get; set; } = null!;
    public string Model { get; set; } = null!;
    public int Capacity { get; set; }
    public decimal RatePerKM { get; set; }
    public bool IsAvailable { get; set; }
    public string? ImageUrl { get; set; }
}

public class VehicleDto
{
    public string VehicleNumber { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Model { get; set; } = null!;
    public int Capacity { get; set; }
    public decimal RatePerKM { get; set; }
    public bool IsAvailable { get; set; }
    public string? ImageUrl { get; set; }
}
