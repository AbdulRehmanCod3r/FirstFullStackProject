using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;
using System.Collections.Generic;

namespace Nortwind.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomersController : ControllerBase
    {
        // -------------------
        // GET ALL
        // -------------------
        [HttpGet(Name = "GetCustomers")]
        public ActionResult<IEnumerable<CustomerListItemDto>> Get()
        {
            var customers = CustomerRepository.GetAllCustomers();
            return Ok(customers);
        }

        // -------------------
        // GET BY ID
        // -------------------
        [HttpGet("{id}", Name = "GetCustomerById")]
        public ActionResult<CustomerListItemDto> Get(string id)
        {
            var customer = CustomerRepository.GetCustomerById(id);
            if (customer == null)
                return NotFound(new { message = "Customer not found." });

            return Ok(customer);
        }

        // -------------------
        // CREATE
        // -------------------
        [HttpPost(Name = "CreateCustomer")]
        public IActionResult Post([FromBody] CreateCustomerDto model)
        {
            if (CustomerRepository.IsExists(model.CustomerID))
                return Conflict(new { message = "Customer with this ID already exists." });

            string result = CustomerRepository.InsertCustomer(model);

            if (!string.IsNullOrEmpty(result))
                return Ok(new { message = "Customer created successfully." });

            return BadRequest(new { message = "Insert failed." });
        }

        // -------------------
        // UPDATE
        // -------------------
        [HttpPut("{id}", Name = "UpdateCustomer")]
        public IActionResult Put(string id, [FromBody] UpdateCustomerDto model)
        {
            var existing = CustomerRepository.GetCustomerById(id);
            if (existing == null)
                return NotFound(new { message = "Customer not found." });

            int result = CustomerRepository.UpdateCustomer(id, model);

            if (result > 0)
                return Ok(new { message = "Customer updated successfully." });

            return BadRequest(new { message = "Update failed." });
        }

        // -------------------
        // DELETE
        // -------------------
        [HttpDelete("{id}", Name = "DeleteCustomer")]
        public IActionResult Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return BadRequest(new { message = "Invalid customer ID." });

            var existing = CustomerRepository.GetCustomerById(id);
            if (existing == null)
                return NotFound(new { message = "Customer not found." });

            bool result = CustomerRepository.DeleteCustomer(id, out string errorMessage);

            if (result)
                return Ok(new { message = "Customer deleted successfully." });

            // Return appropriate message if deletion failed due to related orders
            if (errorMessage != null && errorMessage.Contains("related orders"))
                return BadRequest(new { message = errorMessage });

            return StatusCode(500, new { message = "Delete operation failed.", detail = errorMessage });
        }



    }
}
