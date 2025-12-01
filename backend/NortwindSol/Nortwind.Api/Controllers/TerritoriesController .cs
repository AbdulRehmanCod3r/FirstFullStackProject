using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TerritoriesController : ControllerBase
{

    private readonly ILogger<TerritoriesController> _logger;

    public TerritoriesController(ILogger<TerritoriesController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetTerritory")]
    public IActionResult Get()
    {
        return Ok(TerritoriesRepository.GetAllTerritory());
    }

    [HttpGet("{id}", Name = "GetTerritoryById")]
    public IActionResult GetById(int id)
    {
        if (!TerritoriesRepository.IsExists(id))
        {
            return NotFound();
        }

        return Ok(TerritoriesRepository.GetTerritoryById(id));
    }

    [HttpDelete("{id}", Name = "DeleteTerritory")]
    public IActionResult DeleteTerritory(int id)
    {
        if (!TerritoriesRepository.IsExists(id))
        {
            return NotFound();
        }

        TerritoriesRepository.DeleteTerritory(id);
        return NoContent();
    }

    [HttpPost(Name = "AddTerritory")]
    public IActionResult Add([FromBody] CreateTerritoryDto dto)
    {
        TerritoriesRepository.InsertTeritory(dto);
        return Created(string.Empty, new { Id = dto.TerritoryID });
    }

    [HttpPut("{id}", Name = "UpdateTerritory")]
    public IActionResult Update(int id, [FromBody] UpdateTerritoryDto dto)
    {
        if (!TerritoriesRepository.IsExists(id))
        {
            return NotFound();
        }

        TerritoriesRepository.UpdateTerritory(id, dto);
        return NoContent();
    }
}
