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
    public ActionResult<SupplierListItemDto> Get(int  id)
    {
        var supplier = SupplierRepository.GetSupplierById(id);
        if (supplier == null)
            return NotFound(new { message = "Supplier not found." });

        return Ok(supplier);
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
    public IActionResult Put(int id, [FromBody] UpdateSupplierDto dto)
    {

        var existing = SupplierRepository.GetSupplierById(id);
        if (existing == null)
            return NotFound(new { message = "Supplier not found." });

        int result = SupplierRepository.UpdateSuppliers(id, dto);

        if (result > 0)
            return Ok(new { message = "Supplier updated successfully." });

        return BadRequest(new { message = "Update failed." });
    }
}
