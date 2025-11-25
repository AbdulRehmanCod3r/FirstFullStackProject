using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class EmployeeTerritoriesController : ControllerBase
{
    

    private readonly ILogger<EmployeeTerritoriesController> _logger;

    public EmployeeTerritoriesController(ILogger<EmployeeTerritoriesController> logger)
    {
        _logger = logger;
    }
    [HttpGet(Name = "GetEmployeeTerritories")]
    public IEnumerable<EmployeeTerritoriesListItemDto> Get()
    {
        var repo = new EmployeeTerritoriesRepository();
        return repo.GetEmployeeTerritories();
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var repo = new EmployeeTerritoriesRepository();

        // First check if customer exists
        var employees = repo.GetEmployeeTerritoriesId(id);
        if (employees == null)
            return NotFound("EmployeeTerritory not found!");

        // Call your delete method
        repo.DeleteEmployeeTerritories(id);

        return Ok();
    }

    [HttpPost(Name = "AddEmployeeTerritory")]
    public IActionResult Create([FromBody] CreateEmployeeTerritoriesDto employee)
    {
        var repo = new EmployeeTerritoriesRepository();

        bool result = repo.AddEmployeeTerritories(employee);

        if (result)
            return Ok("EmployeeTerritory created successfully!");

        return BadRequest("Failed to create EmployeeTerritory!");
    }
    [HttpPut("{id}", Name = "UpdateEmployeeTerritoryByID")]
    public IActionResult Update(string id, [FromBody] UpdateEmployeeTerritoriesDto employee)
    {
        var repo = new EmployeeTerritoriesRepository();

        bool result = repo.UpdateEmployeeTerritories(id, employee);

        if (result)
            return Ok("EmployeeTerritory created successfully!");

        return BadRequest("Failed to create EmployeeTerritory!");
    }
    [HttpGet("{id}")]
    public IActionResult Get(string id)
    {
        var repo = new EmployeeTerritoriesRepository();
        var employee = repo.GetEmployeeTerritoriesId(id);

        if (employee == null)
            return NotFound("EmployeeTerritory not found!");

        return Ok(employee);
    }


}

