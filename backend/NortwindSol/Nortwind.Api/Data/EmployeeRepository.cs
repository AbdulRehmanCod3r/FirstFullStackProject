
using Microsoft.Data.SqlClient;
using Nortwind.Api.Constants;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class EmployeeRepository
    {

        public bool AddEmployee(CreateEmployeeDto dto)
        {
            string insertquery = "INSERT INTO Employees(LastName, FirstName, Title, TitleOfCourtesy, BirthDate, HireDate,Address, City, Region, PostalCode, Country, HomePhone, Extension, Notes, ReportsTo, PhotoPath)" +
                "VALUES(@LastName, @FirstName,@Title,@TitleOfCourtesy,@BirthDate,@HireDate,@Address,@City,@Region,@PostalCode,@Country,@HomePhone,@Extension,@Notes,@ReportsTo,@PhotoPath)";

            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(insertquery, con))
                {
                    cmd.Parameters.AddWithValue("@LastName", dto.LastName);
                    cmd.Parameters.AddWithValue("@FirstName", dto.FirstName);
                    cmd.Parameters.AddWithValue("@Title", dto.Title);
                    cmd.Parameters.AddWithValue("@TitleOfCourtesy", dto.TitleOfCourtesy);
                    cmd.Parameters.AddWithValue("@BirthDate", dto.BirthDate);
                    cmd.Parameters.AddWithValue("@HireDate", dto.HireDate);
                    cmd.Parameters.AddWithValue("@Address", dto.Address);
                    cmd.Parameters.AddWithValue("@City", dto.City);
                    cmd.Parameters.AddWithValue("@Region", dto.Region);
                    cmd.Parameters.AddWithValue("@PostalCode", dto.PostalCode);
                    cmd.Parameters.AddWithValue("@Country", dto.Country);
                    cmd.Parameters.AddWithValue("@HomePhone", dto.HomePhone);
                    cmd.Parameters.AddWithValue("@Extension", dto.Extension);
                    
                    cmd.Parameters.AddWithValue("@Notes", dto.Notes);
                    cmd.Parameters.AddWithValue("@ReportsTo", DBNull.Value);
                    cmd.Parameters.AddWithValue("@PhotoPath", DBNull.Value);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public List<EmployeesListItemDto> GetEmployee()
        {
            List<EmployeesListItemDto> employees = new List<EmployeesListItemDto>();
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string selectquery = "SELECT * FROM Employees";
                using (SqlCommand cmd = new SqlCommand(selectquery, con))
                {
                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        employees.Add(new EmployeesListItemDto
                        {
                            EmployeeID = (int)dr["EmployeeID"],
                            LastName = dr["LastName"]?.ToString(),
                            FirstName = dr["FirstName"]?.ToString(),
                            Title = dr["Title"]?.ToString(),
                            TitleOfCourtesy = dr["TitleOfCourtesy"]?.ToString(),
                            BirthDate = (DateTime)dr["BirthDate"],
                            HireDate = (DateTime)dr["HireDate"],
                            Address = dr["Address"]?.ToString(),
                            City = dr["City"]?.ToString(),
                            Region = dr["Region"]?.ToString(),
                            PostalCode = dr["PostalCode"]?.ToString(),
                            Country = dr["Country"]?.ToString(),
                            HomePhone = dr["HomePhone"]?.ToString(),
                            Extension = dr["Extension"]?.ToString(),
                            
                            Notes = dr["Notes"]?.ToString(),
                            ReportsTo = dr["ReportsTo"] == DBNull.Value ? null : (int?)dr["ReportsTo"],
                            PhotoPath = dr["PhotoPath"]?.ToString()
                        });
                    }
                }
                return employees;
            }
        }

        public EmployeesListItemDto GetEmployeeById(int employeeId)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string query = "SELECT * FROM Employees WHERE EmployeeID=@EmployeeID";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@EmployeeID", employeeId);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    return new EmployeesListItemDto
                    {
                        EmployeeID = (int)dr["EmployeeID"],
                        LastName = dr["LastName"]?.ToString(),
                        FirstName = dr["FirstName"]?.ToString(),
                        Title = dr["Title"]?.ToString(),
                        TitleOfCourtesy = dr["TitleOfCourtesy"]?.ToString(),
                        BirthDate = (DateTime)dr["BirthDate"],
                        HireDate = (DateTime)dr["HireDate"],
                        Address = dr["Address"]?.ToString(),
                        City = dr["City"]?.ToString(),
                        Region = dr["Region"]?.ToString(),
                        PostalCode = dr["PostalCode"]?.ToString(),
                        Country = dr["Country"]?.ToString(),
                        HomePhone = dr["HomePhone"]?.ToString(),
                        Extension = dr["Extension"]?.ToString(),
                        Notes = dr["Notes"]?.ToString(),
                        ReportsTo = dr["ReportsTo"] == DBNull.Value ? null : (int?)dr["ReportsTo"],
                        PhotoPath = dr["PhotoPath"]?.ToString()
                    };
                }
            }

            return null;
        }
        public void DeleteEmployee(int EmployeeID)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                con.Open();
                // 4. Finally delete the employee row
                string query = @"DELETE FROM Employees 
                        WHERE EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public bool UpdateEmployee(int id, UpdateEmployeeDto employee)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string query =
    "UPDATE Employees SET " +
    "FirstName=@FirstName, " +
    "LastName=@LastName, " +
    "Title=@Title, " +
    "TitleOfCourtesy=@TitleOfCourtesy, " +
    "BirthDate=@BirthDate, " +
    "HireDate=@HireDate, " +
    "Address=@Address, " +
    "City=@City, " +
    "Region=@Region, " +
    "PostalCode=@PostalCode, " +
    "Country=@Country, " +
    "HomePhone=@HomePhone, " +
    "Extension=@Extension, " +
    "Notes=@Notes, " +
    "ReportsTo=@ReportsTo, " +
    "PhotoPath=@PhotoPath " +
    "WHERE EmployeeID=@EmployeeID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@FirstName", employee.FirstName);
                cmd.Parameters.AddWithValue("@LastName", employee.LastName);
                cmd.Parameters.AddWithValue("@Title", employee.Title);
                cmd.Parameters.AddWithValue("@TitleOfCourtesy", employee.TitleOfCourtesy);
                cmd.Parameters.AddWithValue("@BirthDate", employee.BirthDate);
                cmd.Parameters.AddWithValue("@HireDate", employee.HireDate);
                cmd.Parameters.AddWithValue("@Address", employee.Address);
                cmd.Parameters.AddWithValue("@City", employee.City);
                cmd.Parameters.AddWithValue("@Region", employee.Region);
                cmd.Parameters.AddWithValue("@PostalCode", employee.PostalCode);
                cmd.Parameters.AddWithValue("@Country", employee.Country);
                cmd.Parameters.AddWithValue("@HomePhone", employee.HomePhone);
                cmd.Parameters.AddWithValue("@Extension", employee.Extension);
                cmd.Parameters.AddWithValue("@Notes", employee.Notes);
                cmd.Parameters.AddWithValue("@ReportsTo", employee.ReportsTo);
                cmd.Parameters.AddWithValue("@PhotoPath", employee.PhotoPath);
                cmd.Parameters.AddWithValue("@EmployeeID", id);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
