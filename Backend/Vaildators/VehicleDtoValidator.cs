using FluentValidation;
using Vehicle_Booking.Models;

public class VehicleDtoValidator : AbstractValidator<VehicleDto>
{
    public VehicleDtoValidator()
    {
        RuleFor(x => x.VehicleNumber)
            .NotEmpty().WithMessage("Vehicle number is required.")
            .MaximumLength(50);

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required.")
            .MaximumLength(50);

        RuleFor(x => x.Model)
            .NotEmpty().WithMessage("Model is required.")
            .MaximumLength(100);

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("Capacity must be greater than 0.")
            .LessThanOrEqualTo(100).WithMessage("Capacity must be less than or equal to 100.");

        RuleFor(x => x.RatePerKM)
            .GreaterThan(0).WithMessage("Rate per KM must be greater than 0.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(255)
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));
    }
} 