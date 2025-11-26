using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class RegionController : ControllerBase
{
    

    private readonly ILogger<RegionController> _logger;

    public RegionController(ILogger<RegionController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetRegions")]
    public IEnumerable<RegionListItemDto> Get()
    {
        var repo = new RegionRepository();
        return repo.GetRegion();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var repo = new RegionRepository();

        // First check if customer exists
        var employees = repo.GetRegionById(id);
        if (employees == null)
            return NotFound("Region not found!");

        // Call your delete method
        repo.DeleteRegion(id);

        return Ok();
    }

    [HttpPost(Name = "AddRegion")]
    public IActionResult Create([FromBody] CreateRegionDto region)
    {
        var repo = new RegionRepository();

        bool result = repo.AddRegion(region);

        if (result)
            return Ok("Region created successfully!");

        return BadRequest("Failed to create Region!");
    }

    [HttpPut("{id}", Name = "UpdateRegion")]
    public IActionResult Update(int id, [FromBody] UpdateRegionDto region)
    {
        var repo = new RegionRepository();

        bool result = repo.UpdateRegion(id, region);

        if (result)
            return Ok("Region Update successfully!");

        return BadRequest("Failed to Update Region!");
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var repo = new RegionRepository();
        var region = repo.GetRegionById(id);

        if (region == null)
            return NotFound("Region not found!");

        return Ok(region);
    }
}




















    
  