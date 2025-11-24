
using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Data.Model;
namespace Nortwind.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly ILogger<EmployeesController> _logger;
        public EmployeesController(ILogger<EmployeesController> logger)
        {
            _logger = logger;
        }
        [HttpGet(Name = "GetEmployees")]
        public IEnumerable<Employee> Get()
        {
            var repo = new EmployeeRepository();
            return repo.Getemployee();
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var repo = new EmployeeRepository();

            // First check if customer exists
            var employees = repo.GetEmployyeById(id);
            if (employees == null)
                return NotFound("employee not found!");

            // Call your delete method
            bool result = repo.Deleteemployee(id);

            if (result)
                return Ok("Employee deleted successfully!");

            return BadRequest("Failed to delete customer.");
        }
        [HttpPost(Name = "Addemployees")]
        public IActionResult Create([FromBody] Employee employee)
        {
            var repo = new EmployeeRepository();

            bool result = repo.Addemployee(employee);

            if (result)
                return Ok("Employee created successfully!");

            return BadRequest("Failed to create employee!");
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var repo = new EmployeeRepository();
            var employee = repo.GetEmployyeById(id);

            if (employee == null)
                return NotFound("Employee not found!");

            return Ok(employee);
        }
    }
}

