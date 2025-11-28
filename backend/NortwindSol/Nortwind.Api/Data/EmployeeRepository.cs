
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

                // 1. Parameters where null is not expected (assuming these are non-nullable strings)
                cmd.Parameters.AddWithValue("@FirstName", employee.FirstName);
                cmd.Parameters.AddWithValue("@LastName", employee.LastName);

                // 2. Parameters that are DATES (should usually be handled explicitly, but AddWithValue often works)
                cmd.Parameters.AddWithValue("@BirthDate", employee.BirthDate);
                cmd.Parameters.AddWithValue("@HireDate", employee.HireDate);

                // 3. Parameters where NULL is possible (Use ?? DBNull.Value)

                // The nullable integer that caused the original error:
                cmd.Parameters.AddWithValue("@ReportsTo", (object)employee.ReportsTo ?? DBNull.Value);

                // Other potentially nullable string/object fields:
                cmd.Parameters.AddWithValue("@Title", (object)employee.Title ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TitleOfCourtesy", (object)employee.TitleOfCourtesy ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Address", (object)employee.Address ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@City", (object)employee.City ?? DBNull.Value);

                // NOTE: Region is nullable in Northwind
                cmd.Parameters.AddWithValue("@Region", (object)employee.Region ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@PostalCode", (object)employee.PostalCode ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Country", (object)employee.Country ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@HomePhone", (object)employee.HomePhone ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Extension", (object)employee.Extension ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Notes", (object)employee.Notes ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PhotoPath", (object)employee.PhotoPath ?? DBNull.Value);


                // 4. The WHERE clause parameter
                cmd.Parameters.AddWithValue("@EmployeeID", id);

                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}