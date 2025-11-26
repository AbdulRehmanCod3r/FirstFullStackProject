namespace Nortwind.Api.Dto;

public class CreateOrderDto
{
    public string CustomerID { get; set; } = string.Empty;
    public int? EmployeeID { get; set; }
    public DateTime? OrderDate { get; set; }
    public DateTime? RequiredDate { get; set; }
    public int? ShipVia { get; set; }
    public decimal? Freight { get; set; }
    public string? ShipName { get; set; }
    public string? ShipAddress { get; set; }
    public string? ShipCity { get; set; }
    public string? ShipRegion { get; set; }
    public string? ShipPostalCode { get; set; }
    public string? ShipCountry { get; set; }

    // List of details for this order
    public List<OrderDetailDto> OrderDetails { get; set; } = new();
}


