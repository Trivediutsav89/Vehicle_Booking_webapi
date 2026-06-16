using System;
using Newtonsoft.Json;

namespace Vehicle_Booking.Models
{
    public partial class Payment
    {
        public int PaymentId { get; set; }

        public int BookingId { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        public string Status { get; set; } = null!;

        [JsonIgnore]
        public virtual Booking? Booking { get; set; }
    }
}

public class PaymentCreateDto
{
    public int BookingId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Status { get; set; } = null!;
}

public class PaymentUpdateDto
{
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Status { get; set; } = null!;
}

public class PaymentDto
{
    public int BookingId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Status { get; set; } = null!;
}
