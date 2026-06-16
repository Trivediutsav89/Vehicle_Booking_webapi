using FluentValidation;
using Vehicle_Booking.Models;

public class DriverDtoValidator : AbstractValidator<DriverDto>
{
    public DriverDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100);

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .Matches(@"^[0-9]{10,15}$").WithMessage("Phone must be 10-15 digits.");

        RuleFor(x => x.AssignedVehicleId)
            .GreaterThan(0).When(x => x.AssignedVehicleId.HasValue)
            .WithMessage("Assigned vehicle ID must be greater than 0 if provided.");

        RuleFor(x => x.IsActive)
            .NotNull();
    }
} 