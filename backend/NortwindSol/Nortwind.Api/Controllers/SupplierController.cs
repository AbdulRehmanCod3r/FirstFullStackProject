using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SupplierController : ControllerBase
{

    private readonly ILogger<SupplierController> _logger;

    public SupplierController(ILogger<SupplierController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetSuppliers")]
    public IActionResult Get()
    {
        return Ok(SupplierRepository.GetAllSuppliers());
    }

    [HttpGet("{id}", Name = "GetSupplierById")]
    public IActionResult GetSupplierById(int id)
    {
        if (!SupplierRepository.IsExists(id))
        {
            return NotFound();
        }

        return Ok(SupplierRepository.GetSupplierById(id));
    }

    [HttpDelete("{id}", Name = "DeleteSupplier")]
    public IActionResult DeleteSupplier(int id)
    {
        if (!SupplierRepository.IsExists(id))
        {
            return NotFound();
        }

        SupplierRepository.DeleteSupplier(id);
        return NoContent();
    }

    [HttpPost(Name = "AddSupplier")]
    public IActionResult Add([FromBody] CreateSupplierDto dto)
    {
        var id = SupplierRepository.InsertSupplier(dto);
        return Created(string.Empty, new { Id = id });
    }

    [HttpPut("{id}", Name = "UpdateSupplier")]
    public IActionResult Update(int id, [FromBody] UpdateSupplierDto dto)
    {
        if(!SupplierRepository.IsExists(id))                {
            return NotFound();
        }

        SupplierRepository.UpdateSuppliers(id, dto);
        return NoContent();
    }
}
