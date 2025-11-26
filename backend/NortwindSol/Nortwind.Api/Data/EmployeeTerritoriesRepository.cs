using Microsoft.Data.SqlClient;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class EmployeeTerritoriesRepository
    {
        public string ConnectionString = "Data Source=DESKTOP-S08JF63\\SQLEXPRESS01;Initial Catalog=Northwinddb2;Integrated Security=True;Encrypt=True;Trust Server Certificate=True;";

        public bool AddEmployeeTerritories(CreateEmployeeTerritoriesDto dto)
        {
            string insertquery = "INSERT INTO Employees(EmployeeID,TerritoryID)VALUES(@EmployeeID, @TerritoryID)";



            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(insertquery, con))
                {
                    cmd.Parameters.AddWithValue("EmployeeID", dto.EmployeeID);
                    cmd.Parameters.AddWithValue("TerritoryID", dto.TerritoryID);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public List<EmployeeTerritoriesListItemDto> GetEmployeeTerritories()
        {
            List<EmployeeTerritoriesListItemDto> employeesTerritories = new List<EmployeeTerritoriesListItemDto>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                string selectquery = "select * from EmployeeTerritories";
                using (SqlCommand cmd = new SqlCommand(selectquery, con))
                {
                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        employeesTerritories.Add(new EmployeeTerritoriesListItemDto
                        {
                            EmployeeID = (int)dr["EmployeeID"],
                            TerritoryID = dr["TerritoryID"]?.ToString(),
                            
                        });
                    }
                }
                return employeesTerritories;
            }
        }

        public EmployeeTerritoriesListItemDto GetEmployeeTerritoriesId(string employeeId)
        {
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                string query = "SELECT * FROM EmployeeTerritories WHERE TerritoryID=@TerritoryID";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@TerritoryID", employeeId);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    return new EmployeeTerritoriesListItemDto
                    {
                        EmployeeID = (int)dr["EmployeeID"],
                        TerritoryID = dr["TerritoryID"]?.ToString(),
                        
                    };
                }
            }

            return null;
        }
        public void DeleteEmployeeTerritories(string TerritoryID)
        {
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                con.Open();
                // 4. Finally delete the employee row
                string query = @"DELETE FROM EmployeeTerritories 
                        WHERE TerritoryID = @TerritoryID";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TerritoryID", TerritoryID);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public bool UpdateEmployeeTerritories(string id, UpdateEmployeeTerritoriesDto employee)
        {
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                string query = "UPDATE EmployeeTerritories SET TerritoryID=@TerritoryID";






                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@TerritoryID", employee.TerritoryID);
                
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }




    }
}
