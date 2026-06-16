using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Vehicle_Booking.Models
{
    public partial class Booking
    {
        public int BookingId { get; set; }

        public int UserId { get; set; }

        public int VehicleId { get; set; }

        public DateTime FromDateTime { get; set; }

        public DateTime ToDateTime { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        [JsonIgnore]
        public virtual User? User { get; set; }

        [JsonIgnore]
        public virtual Vehicle? Vehicle { get; set; }

        [JsonIgnore]
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}

public class BookingCreateDto
{
    public int UserId { get; set; }
    public int VehicleId { get; set; }
    public DateTime FromDateTime { get; set; }
    public DateTime ToDateTime { get; set; }
    public string? Status { get; set; }
}

public class BookingUpdateDto
{
    public DateTime FromDateTime { get; set; }
    public DateTime ToDateTime { get; set; }
    public string? Status { get; set; }
}

public class BookingDto
{
    public int UserId { get; set; }
    public int VehicleId { get; set; }
    public DateTime FromDateTime { get; set; }
    public DateTime ToDateTime { get; set; }
    public string? Status { get; set; }
}
