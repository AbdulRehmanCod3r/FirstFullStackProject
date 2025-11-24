
using Microsoft.Data.SqlClient;
using Nortwind.Api.Data.Model;

namespace Nortwind.Api.Data
{
    public class EmployeeRepository
    {
        public string Connectionstring = "Data Source=DESKTOP-S08JF63\\SQLEXPRESS01;Initial Catalog=Northwinddb2;Integrated Security=True;Encrypt=True;Trust Server Certificate=True;";
        public bool Addemployee(Employee e1)
        {
            string insertquery = "INSERT INTO Employees(LastName, FirstName, Title, TitleOfCourtesy, BirthDate, HireDate,Address, City, Region, PostalCode, Country, HomePhone, Extension,Photo, Notes, ReportsTo, PhotoPath)" +
                "VALUES(@LastName, @FirstName,@Title,@TitleOfCourtesy,@BirthDate,@HireDate,@Address,@City,@Region,@PostalCode,@Country,@HomePhone,@Extension,@Photo,@Notes,@ReportsTo,@PhotoPath)";
            using (SqlConnection con = new SqlConnection(Connectionstring))
            {
                using (SqlCommand cmd = new SqlCommand(insertquery, con))
                {
                    cmd.Parameters.AddWithValue("@LastName", e1.LastName);
                    cmd.Parameters.AddWithValue("@FirstName", e1.FirstName);
                    cmd.Parameters.AddWithValue("@Title", e1.Title);
                    cmd.Parameters.AddWithValue("@TitleOfCourtesy", e1.TitleOfCourtesy);
                    cmd.Parameters.AddWithValue("@BirthDate", e1.BirthDate);
                    cmd.Parameters.AddWithValue("@HireDate", e1.HireDate);
                    cmd.Parameters.AddWithValue("@Address", e1.Address);
                    cmd.Parameters.AddWithValue("@City", e1.City);
                    cmd.Parameters.AddWithValue("@Region", e1.Region);
                    cmd.Parameters.AddWithValue("@PostalCode", e1.PostalCode);
                    cmd.Parameters.AddWithValue("@Country", e1.Country);
                    cmd.Parameters.AddWithValue("@HomePhone", e1.HomePhone);
                    cmd.Parameters.AddWithValue("@Extension", e1.Extension);
                    cmd.Parameters.Add("@Photo", System.Data.SqlDbType.Image).Value = DBNull.Value;
                    cmd.Parameters.AddWithValue("@Notes", e1.Notes);
                    cmd.Parameters.AddWithValue("@ReportsTo", DBNull.Value);
                    cmd.Parameters.AddWithValue("@PhotoPath", DBNull.Value);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public List<Employee> Getemployee()
        {
            List<Employee> employees = new List<Employee>();
            using (SqlConnection con = new SqlConnection(Connectionstring))
            {
                string selectquery = "SELECT * FROM Employees";
                using (SqlCommand cmd = new SqlCommand(selectquery, con))
                {
                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        employees.Add(new Employee
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
                            Photo = dr["Photo"] == DBNull.Value ? null : (byte[])dr["Photo"],
                            Notes = dr["Notes"]?.ToString(),
                            ReportsTo = dr["ReportsTo"] == DBNull.Value ? null : (int?)dr["ReportsTo"],
                            PhotoPath = dr["PhotoPath"]?.ToString()
                        });
                    }
                }
                return employees;
            }
        }
        public Employee GetEmployyeById(int EmployeeID)
        {
            Employee emp = null;
            using (SqlConnection con = new SqlConnection(Connectionstring))
            {
                string query = "SELECT * FROM Employees WHERE EmployeeID=@EmployeeID";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    emp = new Employee
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
                        Photo = dr["Photo"] == DBNull.Value ? null : (byte[])dr["Photo"],
                        Notes = dr["Notes"]?.ToString(),
                        ReportsTo = dr["ReportsTo"] == DBNull.Value ? null : (int?)dr["ReportsTo"],
                        PhotoPath = dr["PhotoPath"]?.ToString()
                    };
                }
            }
            return emp;
        }
        public bool Deleteemployee(int EmployeeID)
        {
            using (SqlConnection con = new SqlConnection(Connectionstring))
            {
                con.Open();
                SqlTransaction tx = con.BeginTransaction();

                try
                {
                    // 1. Remove self-reference (Employees who report to this employee)
                    string q1 = @"UPDATE Employees 
                          SET ReportsTo = NULL 
                          WHERE ReportsTo = @EmployeeID";

                    using (SqlCommand cmd = new SqlCommand(q1, con, tx))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                        cmd.ExecuteNonQuery();
                    }

                    // 2. Delete related EmployeeTerritories rows
                    string q2 = @"DELETE FROM EmployeeTerritories 
                          WHERE EmployeeID = @EmployeeID";

                    using (SqlCommand cmd = new SqlCommand(q2, con, tx))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                        cmd.ExecuteNonQuery();
                    }

                    // 3. Nullify Orders assigned to this employee
                    string q3 = @"UPDATE Orders 
                          SET EmployeeID = NULL 
                          WHERE EmployeeID = @EmployeeID";

                    using (SqlCommand cmd = new SqlCommand(q3, con, tx))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                        cmd.ExecuteNonQuery();
                    }

                    // 4. Finally delete the employee row
                    string q4 = @"DELETE FROM Employees 
                          WHERE EmployeeID = @EmployeeID";

                    using (SqlCommand cmd = new SqlCommand(q4, con, tx))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                        cmd.ExecuteNonQuery();
                    }

                    // Commit if everything succeeded
                    tx.Commit();
                    return true;
                }
                catch
                {
                    // Rollback if any error occurs
                    tx.Rollback();
                    return false;
                }
            }
        }
        public bool Updateemployee(Employee employee)
        {
            using (SqlConnection con = new SqlConnection(Connectionstring))
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
                cmd.Parameters.AddWithValue("@EmployeeID", employee.EmployeeID);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
