using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{

    private readonly ILogger<ProductsController> _logger;

    public ProductsController(ILogger<ProductsController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetProducts")]
    public IActionResult Get()
    {
        return Ok(ProductRepository.GetAllProducts());
    }

    [HttpGet("{id}", Name = "GetProductById")]
    public IActionResult GetById(int id)
    {
        if (!ProductRepository.IsExists(id))
        {
            return NotFound();
        }

        return Ok(ProductRepository.GetProductById(id));
    }

    [HttpDelete("{id}", Name = "DeletProduct")]
    public IActionResult DeleteProduct(int id)
    {
        if (!ProductRepository.IsExists(id))
        {
            return NotFound();
        }

        ProductRepository.DeleteProduct(id);
        return NoContent();
    }

    [HttpPost(Name = "AddProduct")]
    public IActionResult Add([FromBody] CreateProductDto dto)
    {
        var id = ProductRepository.InsertProduct(dto);
        return Created(string.Empty, new { Id = id });
    }

    [HttpPut("{id}", Name = "UpdateProduct")]
    public IActionResult Update(int id, [FromBody] UpdateProductDto dto)
    {
        if(!ProductRepository.IsExists(id))                {
            return NotFound();
        }

        ProductRepository.UpdateProducts(id, dto);
        return NoContent();
    }
}
