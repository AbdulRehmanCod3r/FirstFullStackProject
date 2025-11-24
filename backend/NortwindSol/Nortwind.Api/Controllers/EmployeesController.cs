using Microsoft.AspNetCore.Mvc;
using Nortwind.Api.Data;
using Nortwind.Api.Dto;

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
        public IEnumerable<EmployeesListItemDto> Get()
        {
            var repo = new EmployeeRepository();
            return repo.GetEmployee();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var repo = new EmployeeRepository();

            // First check if customer exists
            var employees = repo.GetEmployeeById(id);
            if (employees == null)
                return NotFound("employee not found!");

            // Call your delete method
            repo.DeleteEmployee(id);

            return Ok();
        }

        [HttpPost(Name = "AddEmployees")]
        public IActionResult Create([FromBody] CreateEmployeeDto employee)
        {
            var repo = new EmployeeRepository();

            bool result = repo.AddEmployee(employee);

            if (result)
                return Ok("Employee created successfully!");

            return BadRequest("Failed to create employee!");
        }

        [HttpPut("{id}", Name = "UpdateEmployees")]
        public IActionResult Update(int id, [FromBody] UpdateEmployeeDto employee)
        {
            var repo = new EmployeeRepository();

            bool result = repo.UpdateEmployee(id, employee);

            if (result)
                return Ok("Employee created successfully!");

            return BadRequest("Failed to create employee!");
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var repo = new EmployeeRepository();
            var employee = repo.GetEmployeeById(id);

            if (employee == null)
                return NotFound("Employee not found!");

            return Ok(employee);
        }
    }
}

