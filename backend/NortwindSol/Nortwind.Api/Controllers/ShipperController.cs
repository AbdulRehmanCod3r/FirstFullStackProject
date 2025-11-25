using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ShipperController : ControllerBase
{

    private readonly ILogger<ShipperController> _logger;

    public ShipperController(ILogger<ShipperController> logger)
    {
        _logger = logger;
    }
    [HttpGet(Name = "GetShipper")]
    public IActionResult Get()
    {
        return Ok(ShipperRepository.GetAllShipper());
    }
    [HttpGet("{id}", Name = "GetShipperById")]
    public IActionResult GetShipperById(int id)
    {
        if (!ShipperRepository.IsExists(id))
        {
            return NotFound();
        }

        return Ok(ShipperRepository.GetShipperById(id));
    }
    [HttpDelete("{id}", Name = "DeleteShipper")]
    public IActionResult DeleteSupplier(int id)
    {
        if (!ShipperRepository.IsExists(id))
        {
            return NotFound();
        }

        ShipperRepository.DeleteShipper(id);
        return NoContent();
    }
    [HttpPost(Name = "AddShiper")]
    public IActionResult Add([FromBody] CreateShipperDto dto)
    {
        var id = ShipperRepository.InsertShipper(dto);
        return Created(string.Empty, new { Id = id });
    }

    [HttpPut("{id}", Name = "UpdateShipper")]
    public IActionResult Update(int id, [FromBody] UpdateShipperDto dto)
    {
        if (!ShipperRepository.IsExists(id))
        {
            return NotFound();
        }

        ShipperRepository.UpdateShipper(id, dto);
        return NoContent();
    }



}

