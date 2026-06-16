using FluentValidation;
using Vehicle_Booking.Models;

public class PaymentDtoValidator : AbstractValidator<PaymentDto>
{
    public PaymentDtoValidator()
    {
        RuleFor(x => x.BookingId)
            .GreaterThan(0).WithMessage("Booking is required.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0.");

        RuleFor(x => x.PaymentDate)
            .NotEmpty().WithMessage("Payment date is required.")
            .LessThanOrEqualTo(DateTime.Now).WithMessage("Payment date cannot be in the future.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => new[] { "Pending", "Paid", "Failed", "Refunded" }.Contains(status))
            .WithMessage("Status must be Pending, Paid, Failed, or Refunded.");
    }
} 