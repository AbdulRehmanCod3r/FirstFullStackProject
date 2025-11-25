using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class CategoryController : ControllerBase
{

    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ILogger<CategoryController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetCategory")]
    public IActionResult Get()
    {
        return Ok(CategoryRepository.GetAllCategory());
    }

    [HttpGet("{id}", Name = "GetCategoryById")]
    public IActionResult GetById(int id)
    {
        if (!CategoryRepository.IsExists(id))
        {
            return NotFound();
        }

        return Ok(CategoryRepository.GetCategoryById(id));
    }

    [HttpDelete("{id}", Name = "DeleteCategory")]
    public IActionResult DeleteCategory(int id)
    {
        if (!CategoryRepository.IsExists(id))
        {
            return NotFound();
        }

        CategoryRepository.DeleteCategories(id);
        return NoContent();
    }

    [HttpPost(Name = "AddCategory")]
    public IActionResult Add([FromBody] CreateCategoryDto dto)
    {
        var id = CategoryRepository.InsertCategory(dto);
        return Created(string.Empty, new { Id = id });
    }

    [HttpPut("{id}", Name = "UpdateCategory")]
    public IActionResult Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        if (!CategoryRepository.IsExists(id))
        {
            return NotFound();
        }

        CategoryRepository.UpdateCategory(id, dto);
        return NoContent();
    }
}
