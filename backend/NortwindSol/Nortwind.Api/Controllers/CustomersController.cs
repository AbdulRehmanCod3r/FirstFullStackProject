using Microsoft.AspNetCore.Mvc;
using  Nortwind.Api.Data;
using static Nortwind.Api.Data.CustomerRepositery;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(ILogger<CustomersController> logger)
        {
            _logger = logger;
        }

        
        [HttpGet(Name = "GetCustomers")]
        public IEnumerable<Customer > Get()
        {
            return CustomerRepositery.GetAllCustomers();
        }

       
        [HttpGet("{id}", Name = "GetCustomerById")]
        public ActionResult<Customer> Get(string id)
        {
            var customer = CustomerRepositery.GetCustomerById(id);

            if (customer == null)
                return NotFound();

            return customer;
        }

        
        [HttpPost(Name = "CreateCustomer")]
        public IActionResult Post(Customer  model)
        {
            int result = CustomerRepositery.InsertCustomer(
                model.Id,
                model.CompanyName,
                model.ContactName,
                model.Country
            );

            if (result > 0)
                return Ok(new { message = "Customer created." });

            return BadRequest("Insert failed.");
        }

        
        [HttpPut("{id}", Name = "UpdateCustomer")]
        public IActionResult Put(string id, Customer model)
        {
            var existing = CustomerRepositery.GetCustomerById(id);

            if (existing == null)
                return NotFound();

            model.Id = id;

            int result = CustomerRepositery.UpdateCustomer(model);

            if (result > 0)
                return Ok(new { message = "Customer updated." });

            return BadRequest("Update failed.");
        }

        
        [HttpDelete("{id}", Name = "DeleteCustomer")]
        public IActionResult Delete(string id)
        {
            var existing = CustomerRepositery.GetCustomerById(id);

            if (existing == null)
                return NotFound();

            int result = CustomerRepositery.DeleteCustomer(id);

            if (result > 0)
                return Ok(new { message = "Customer deleted." });

            return BadRequest("Delete failed.");
        }
    }
}
