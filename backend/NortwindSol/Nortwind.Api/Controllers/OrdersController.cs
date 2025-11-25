using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ILogger<OrdersController> _logger;


    // -------------------
    // GET ALL ORDERS
    // -------------------
    [HttpGet(Name = "GetOrders")]
    public IActionResult Get()
    {
        var orders = OrderRepository.GetAllOrders();
        return Ok(orders);
    }

    // -------------------
    // GET ORDER BY ID
    // -------------------
    [HttpGet("{id}", Name = "GetOrderById")]
    public IActionResult GetById(int id)
    {
        var order = OrderRepository.GetOrderById(id);
        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    // -------------------
    // CREATE ORDER
    // -------------------
    [HttpPost(Name = "AddOrder")]
    public IActionResult Add([FromBody] CreateOrderDto dto)
    {
        try
        {
            int newOrderId = OrderRepository.InsertOrder(dto);
            var order = OrderRepository.GetOrderById(newOrderId);
            return CreatedAtAction(nameof(GetById), new { id = newOrderId }, order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return BadRequest(new { error = ex.Message });
        }
    }

    // -------------------
    // UPDATE ORDER
    // -------------------
    [HttpPut("{id}", Name = "UpdateOrder")]
    public IActionResult Update(int id, [FromBody] UpdateOrderDto dto)
    {
        if (OrderRepository.GetOrderById(id) == null)
        {
            return NotFound();
        }

        bool updated = OrderRepository.UpdateOrder(id, dto);
        if (!updated)
        {
            return BadRequest(new { error = "Failed to update order" });
        }

        var order = OrderRepository.GetOrderById(id);
        return Ok(order);
    }

    // -------------------
    // DELETE ORDER
    // -------------------
    [HttpDelete("{id}", Name = "DeleteOrder")]
    public IActionResult Delete(int id)
    {
        if (OrderRepository.GetOrderById(id) == null)
        {
            return NotFound();
        }

        try
        {
            bool deleted = OrderRepository.DeleteOrder(id);
            if (!deleted)
            {
                return BadRequest(new { error = "Failed to delete order" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting order");
            return BadRequest(new { error = ex.Message });
        }
    }
}

