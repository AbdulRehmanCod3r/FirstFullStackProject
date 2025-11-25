using Microsoft.Data.SqlClient;
using Nortwind.Api.Dto;
using System.Data;

namespace Nortwind.Api.Data
{
    
    // -------------------
    // CUSTOMER REPOSITORY
    // -------------------
    public class CustomerRepository
    {
        private static readonly string connectionString =
            @"Data Source=.\SQLEXPRESS;Initial Catalog=NORTHWIND;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;";

        // -------------------
        // INSERT
        // -------------------
        public static string InsertCustomer(CreateCustomerDto dto)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
        INSERT INTO Customers
            (CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone)
        VALUES
            (@CustomerID, @CompanyName, @ContactName, @ContactTitle, @Address, @City, @Region, @PostalCode, @Country, @Phone);
    ";

            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.Add("@CustomerID", SqlDbType.NChar, 5).Value = dto.CustomerID;
            cmd.Parameters.Add("@CompanyName", SqlDbType.NVarChar, 40).Value = dto.CompanyName;
            cmd.Parameters.Add("@ContactName", SqlDbType.NVarChar, 30).Value = (object?)dto.ContactName ?? DBNull.Value;
            cmd.Parameters.Add("@ContactTitle", SqlDbType.NVarChar, 30).Value = (object?)dto.ContactTitle ?? DBNull.Value;
            cmd.Parameters.Add("@Address", SqlDbType.NVarChar, 60).Value = (object?)dto.Address ?? DBNull.Value;
            cmd.Parameters.Add("@City", SqlDbType.NVarChar, 15).Value = (object?)dto.City ?? DBNull.Value;
            cmd.Parameters.Add("@Region", SqlDbType.NVarChar, 15).Value = (object?)dto.Region ?? DBNull.Value;
            cmd.Parameters.Add("@PostalCode", SqlDbType.NVarChar, 10).Value = (object?)dto.PostalCode ?? DBNull.Value;
            cmd.Parameters.Add("@Country", SqlDbType.NVarChar, 15).Value = dto.Country;
            cmd.Parameters.Add("@Phone", SqlDbType.NVarChar, 24).Value = (object?)dto.Phone ?? DBNull.Value;

            int rows = cmd.ExecuteNonQuery();
            return rows.ToString();
        }


        // -------------------
        // UPDATE
        // -------------------
        public static int UpdateCustomer(string id, UpdateCustomerDto dto)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
                UPDATE Customers SET
                    CompanyName = @CompanyName,
                    ContactName = @ContactName,
                    ContactTitle = @ContactTitle,
                    Address = @Address,
                    City = @City,
                    Region = @Region,
                    PostalCode = @PostalCode,
                    Country = @Country,
                    Phone = @Phone
                WHERE CustomerID = @CustomerID;
            ";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.Add("@CustomerID", SqlDbType.NChar, 5).Value = id;
            cmd.Parameters.Add("@CompanyName", SqlDbType.NVarChar, 40).Value = dto.CompanyName;
            cmd.Parameters.Add("@ContactName", SqlDbType.NVarChar, 30).Value = (object?)dto.ContactName ?? DBNull.Value;
            cmd.Parameters.Add("@ContactTitle", SqlDbType.NVarChar, 30).Value = (object?)dto.ContactTitle ?? DBNull.Value;
            cmd.Parameters.Add("@Address", SqlDbType.NVarChar, 60).Value = (object?)dto.Address ?? DBNull.Value;
            cmd.Parameters.Add("@City", SqlDbType.NVarChar, 15).Value = (object?)dto.City ?? DBNull.Value;
            cmd.Parameters.Add("@Region", SqlDbType.NVarChar, 15).Value = (object?)dto.Region ?? DBNull.Value;
            cmd.Parameters.Add("@PostalCode", SqlDbType.NVarChar, 10).Value = (object?)dto.PostalCode ?? DBNull.Value;
            cmd.Parameters.Add("@Country", SqlDbType.NVarChar, 15).Value = dto.Country;
            cmd.Parameters.Add("@Phone", SqlDbType.NVarChar, 24).Value = (object?)dto.Phone ?? DBNull.Value;

            return cmd.ExecuteNonQuery();
        }


        // -------------------
        // DELETE
        // -------------------
        public static bool DeleteCustomer(string id, out string errorMessage)
        {
            errorMessage = null;
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Check if customer has related orders
                    string checkOrdersQuery = "SELECT COUNT(*) FROM Orders WHERE CustomerID = @CustomerID";
                    using (SqlCommand checkCmd = new SqlCommand(checkOrdersQuery, conn))
                    {
                        checkCmd.Parameters.AddWithValue("@CustomerID", id);
                        int orderCount = (int)checkCmd.ExecuteScalar();

                        if (orderCount > 0)
                        {
                            errorMessage = "Cannot delete customer: related orders exist.";
                            return false;
                        }
                    }

                    // Delete customer
                    string deleteQuery = "DELETE FROM Customers WHERE CustomerID = @CustomerID";
                    using (SqlCommand deleteCmd = new SqlCommand(deleteQuery, conn))
                    {
                        deleteCmd.Parameters.AddWithValue("@CustomerID", id);
                        int rowsAffected = deleteCmd.ExecuteNonQuery();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        

        // -------------------
        // GET ALL
        // -------------------
        public static List<CustomerListItemDto> GetAllCustomers()
        {
            var customers = new List<CustomerListItemDto>();
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
                SELECT CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone
                FROM Customers
                ORDER BY CompanyName;
            ";

            using var cmd = new SqlCommand(query, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                customers.Add(new CustomerListItemDto
                {
                    CustomerID = reader["CustomerID"]?.ToString() ?? string.Empty,
                    CompanyName = reader["CompanyName"]?.ToString() ?? string.Empty,
                    ContactName = reader["ContactName"] != DBNull.Value ? reader["ContactName"].ToString() : null,
                    ContactTitle = reader["ContactTitle"] != DBNull.Value ? reader["ContactTitle"].ToString() : null,
                    Address = reader["Address"] != DBNull.Value ? reader["Address"].ToString() : null,
                    City = reader["City"] != DBNull.Value ? reader["City"].ToString() : null,
                    Region = reader["Region"] != DBNull.Value ? reader["Region"].ToString() : null,
                    PostalCode = reader["PostalCode"] != DBNull.Value ? reader["PostalCode"].ToString() : null,
                    Country = reader["Country"]?.ToString() ?? string.Empty,
                    Phone = reader["Phone"] != DBNull.Value ? reader["Phone"].ToString() : null
                });
            }

            return customers;
        }

        // -------------------
        // GET BY ID
        // -------------------
        public static CustomerListItemDto? GetCustomerById(string id)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
                SELECT CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone
                FROM Customers
                WHERE CustomerID = @CustomerID;
            ";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.Add("@CustomerID", SqlDbType.NChar, 5).Value = id;

            using var reader = cmd.ExecuteReader();
            if (!reader.Read()) return null;

            return new CustomerListItemDto
            {
                CustomerID = reader["CustomerID"]?.ToString() ?? string.Empty,
                CompanyName = reader["CompanyName"]?.ToString() ?? string.Empty,
                ContactName = reader["ContactName"] != DBNull.Value ? reader["ContactName"].ToString() : null,
                ContactTitle = reader["ContactTitle"] != DBNull.Value ? reader["ContactTitle"].ToString() : null,
                Address = reader["Address"] != DBNull.Value ? reader["Address"].ToString() : null,
                City = reader["City"] != DBNull.Value ? reader["City"].ToString() : null,
                Region = reader["Region"] != DBNull.Value ? reader["Region"].ToString() : null,
                PostalCode = reader["PostalCode"] != DBNull.Value ? reader["PostalCode"].ToString() : null,
                Country = reader["Country"]?.ToString() ?? string.Empty,
                Phone = reader["Phone"] != DBNull.Value ? reader["Phone"].ToString() : null
            };
        }

        // -------------------
        // EXISTS
        // -------------------
        public static bool IsExists(string id)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "SELECT COUNT(1) FROM Customers WHERE CustomerID = @CustomerID";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.Add("@CustomerID", SqlDbType.NChar, 5).Value = id;

            return Convert.ToInt32(cmd.ExecuteScalar()) > 0;
        }
    }
}
