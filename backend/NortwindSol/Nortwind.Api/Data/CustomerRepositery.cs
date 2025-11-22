using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace Nortwind.Api.Data
{
    // ===================
    // DTO CLASSES
    // ===================
    public class CreateCustomerDto
    {
        public string CustomerID { get; set; } = null!;  // e.g., "ALFKI"
        public string CompanyName { get; set; } = null!;
        public string? ContactName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; } = null!;
        public string? Phone { get; set; }
    }

    public class UpdateCustomerDto
    {
        public string CompanyName { get; set; } = null!;
        public string? ContactName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; } = null!;
        public string? Phone { get; set; }
    }

    public class CustomerListItemDto
    {
        public string CustomerID { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string? ContactName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; } = null!;
        public string? Phone { get; set; }
    }

    // ===================
    // CUSTOMER REPOSITORY
    // ===================
    public class CustomerRepository
    {
        static string connectionString =
            @"Data Source=.\SQLEXPRESS;Initial Catalog=NorthwindDb;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;";

        // -------------------
        // INSERT
        // -------------------
        public static int InsertCustomer(CreateCustomerDto dto)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
                INSERT INTO Customers
                (
                    CustomerID,
                    CompanyName,
                    ContactName,
                    ContactTitle,
                    Address,
                    City,
                    Region,
                    PostalCode,
                    Country,
                    Phone
                )
                VALUES
                (
                    @CustomerID,
                    @CompanyName,
                    @ContactName,
                    @ContactTitle,
                    @Address,
                    @City,
                    @Region,
                    @PostalCode,
                    @Country,
                    @Phone
                );
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

            return cmd.ExecuteNonQuery();
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
        public static bool DeleteCustomer(string id)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "DELETE FROM Customers WHERE CustomerID = @CustomerID";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.Add("@CustomerID", SqlDbType.NChar, 5).Value = id;

            return cmd.ExecuteNonQuery() > 0;
        }

        // -------------------
        // GET ALL
        // -------------------
        public static List<CustomerListItemDto> GetAllCustomers()
        {
            var customers = new List<CustomerListItemDto>();
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "SELECT * FROM Customers";
            using var cmd = new SqlCommand(query, conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                customers.Add(new CustomerListItemDto
                {
                    CustomerID = reader["CustomerID"].ToString(),
                    CompanyName = reader["CompanyName"].ToString(),
                    ContactName = reader["ContactName"] != DBNull.Value ? reader["ContactName"].ToString() : null,
                    ContactTitle = reader["ContactTitle"] != DBNull.Value ? reader["ContactTitle"].ToString() : null,
                    Address = reader["Address"] != DBNull.Value ? reader["Address"].ToString() : null,
                    City = reader["City"] != DBNull.Value ? reader["City"].ToString() : null,
                    Region = reader["Region"] != DBNull.Value ? reader["Region"].ToString() : null,
                    PostalCode = reader["PostalCode"] != DBNull.Value ? reader["PostalCode"].ToString() : null,
                    Country = reader["Country"].ToString(),
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

            string query = "SELECT * FROM Customers WHERE CustomerID = @CustomerID";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.Add("@CustomerID", SqlDbType.NChar, 5).Value = id;

            using var reader = cmd.ExecuteReader();
            if (!reader.Read()) return null;

            return new CustomerListItemDto
            {
                CustomerID = reader["CustomerID"].ToString(),
                CompanyName = reader["CompanyName"].ToString(),
                ContactName = reader["ContactName"] != DBNull.Value ? reader["ContactName"].ToString() : null,
                ContactTitle = reader["ContactTitle"] != DBNull.Value ? reader["ContactTitle"].ToString() : null,
                Address = reader["Address"] != DBNull.Value ? reader["Address"].ToString() : null,
                City = reader["City"] != DBNull.Value ? reader["City"].ToString() : null,
                Region = reader["Region"] != DBNull.Value ? reader["Region"].ToString() : null,
                PostalCode = reader["PostalCode"] != DBNull.Value ? reader["PostalCode"].ToString() : null,
                Country = reader["Country"].ToString(),
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
