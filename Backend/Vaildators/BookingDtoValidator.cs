using FluentValidation;
using Vehicle_Booking.Models;

public class BookingDtoValidator : AbstractValidator<BookingDto>
{
    public BookingDtoValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("User is required.");

        RuleFor(x => x.VehicleId)
            .GreaterThan(0).WithMessage("Vehicle is required.");

        RuleFor(x => x.FromDateTime)
            .NotEmpty().WithMessage("Start date/time is required.")
            .Must(date => date > DateTime.Now).WithMessage("Start date/time must be in the future.");

        RuleFor(x => x.ToDateTime)
            .NotEmpty().WithMessage("End date/time is required.")
            .GreaterThan(x => x.FromDateTime).WithMessage("End date/time must be after start date/time.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => new[] { "Pending", "Confirmed", "Cancelled", "Completed" }.Contains(status))
            .WithMessage("Status must be Pending, Confirmed, Cancelled, or Completed.");
    }
} 