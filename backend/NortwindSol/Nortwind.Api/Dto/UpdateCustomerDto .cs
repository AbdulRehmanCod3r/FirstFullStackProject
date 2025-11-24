namespace Nortwind.Api.Dto;

public class UpdateCustomerDto
{
    public string CompanyName { get; set; } = null!;
    public string? ContactName { get; set; }
    public string? ContactTitle { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? PostalCode { get; set; }
    public string Country { get; set; } = null!;
    public string? Phone { get; set; }
}
