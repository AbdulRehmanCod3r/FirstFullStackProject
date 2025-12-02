using Microsoft.Data.SqlClient;
using Nortwind.Api.Constants;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data;

public class SupplierRepository
{
    public static int InsertSupplier(CreateSupplierDto dto)
    {
        using (SqlConnection conn = new SqlConnection(NorthwindDatabase.ConnectionString))
        {
            conn.Open();
            string query = @"
                    INSERT INTO Suppliers 
                    (
                        CompanyName,
                        ContactName,
                        ContactTitle,
                        Address,
                        City,
                        Region,
                        PostalCode,
                        Country,
                        Phone,
                        Fax
                    )
                    VALUES
                    (
                        @CompanyName,
                        @ContactName,
                        @ContactTitle,
                        @Address,
                        @City,
                        @Region,
                        @PostalCode,
                        @Country,
                        @Phone,
                        @Fax
                    );

                    SELECT SCOPE_IDENTITY();
                    ";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@CompanyName", dto.CompanyName);
                cmd.Parameters.AddWithValue("@contactName", dto.ContactName);
                cmd.Parameters.AddWithValue("@ContactTitle", dto.ContactTitle);
                cmd.Parameters.AddWithValue("@Address", dto.Address);
                cmd.Parameters.AddWithValue("@City", dto.City);
                cmd.Parameters.AddWithValue("@Region", dto.Region);
                cmd.Parameters.AddWithValue("@PostalCode", dto.PostalCode);
                cmd.Parameters.AddWithValue("@Country", dto.Country);
                cmd.Parameters.AddWithValue("@Phone", dto.Phone);
                cmd.Parameters.AddWithValue("@Fax", dto.Fax);

                return Convert.ToInt32(cmd.ExecuteScalar());
            }

        }
    }

    public static int UpdateSuppliers(int id, UpdateSupplierDto dto)
    {
        using (var conn = new SqlConnection(NorthwindDatabase.ConnectionString))
        {
            string query =
            "UPDATE Suppliers SET " +
            "CompanyName = @CompanyName, " +
            "ContactName = @ContactName, " +
            "ContactTitle = @ContactTitle, " +
            "Address = @Address, " +
            "City = @City, " +
            "Region = @Region, " +
            "PostalCode = @PostalCode, " +
            "Country = @Country, " +
            "Phone = @Phone, " +
            "Fax = @Fax " +
            "WHERE SupplierID = @SupplierID";

            using (var cmd = new SqlCommand(query, conn))
            {
                // PRIMARY KEY – only used in WHERE, NOT in SET
                cmd.Parameters.AddWithValue("@SupplierID", id);

                // FIX parameter names (correct case)
                cmd.Parameters.AddWithValue("@CompanyName", dto.CompanyName ?? string.Empty);
                cmd.Parameters.AddWithValue("@ContactName", dto.ContactName ?? string.Empty);
                cmd.Parameters.AddWithValue("@ContactTitle", dto.ContactTitle ?? string.Empty);
                cmd.Parameters.AddWithValue("@Address", dto.Address ?? string.Empty);
                cmd.Parameters.AddWithValue("@City", dto.City ?? string.Empty);
                cmd.Parameters.AddWithValue("@Region", dto.Region ?? string.Empty);
                cmd.Parameters.AddWithValue("@PostalCode", dto.PostalCode ?? string.Empty);
                cmd.Parameters.AddWithValue("@Country", dto.Country ?? string.Empty);
                cmd.Parameters.AddWithValue("@Phone", dto.Phone ?? string.Empty);
                cmd.Parameters.AddWithValue("@Fax", dto.Fax ?? string.Empty);

                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }


    public static void DeleteSupplier(int SupplierId)
    {
        using (SqlConnection conn = new SqlConnection(NorthwindDatabase.ConnectionString))
        {
            conn.Open();
            string query = "DELETE FROM Suppliers WHERE SupplierId = @SupplierID";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@SupplierID", SupplierId);
                cmd.ExecuteNonQuery();
            }
        }
    }

    public static List<SupplierListItemDto> GetAllSuppliers()
    {
        var Supplier = new List<SupplierListItemDto>();

        string query = @"
SELECT 
    S.SupplierID,
    s.CompanyName,
    s.ContactName,
    s.ContactTitle,
    s.Address,
    s.City,
    s.Region,
    s.PostalCode,
    s.Country,
    s.Phone,
    s.Fax
    FROM Suppliers s";




        using (SqlConnection conn = new SqlConnection(NorthwindDatabase.ConnectionString))
        {
            conn.Open();
            using (SqlCommand cmd = new SqlCommand(query, conn))
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    Supplier.Add(new SupplierListItemDto
                    {
                        SupplierID = reader["SupplierID"].ToString(),
                        CompanyName = reader["CompanyName"].ToString(),
                        ContactName = reader["ContactName"].ToString(),
                        ContactTitle = reader["ContactTitle"].ToString(),
                        Address = reader["Address"].ToString(),
                        City = reader["City"].ToString(),
                        Region = reader["Region"].ToString(),
                        PostalCode = reader["PostalCode"].ToString(),
                        Country = reader["Country"].ToString(),
                        Phone = reader["Phone"] != DBNull.Value
                               ? reader["Phone"].ToString()
                                : string.Empty,
                        Fax = reader["Fax"] != DBNull.Value
                               ? reader["Fax"].ToString()
                               : string.Empty

                    });
                }
            }
        }

        return Supplier;
    }

    public static bool IsExists(int id)
    {
        using (var conn = new SqlConnection(NorthwindDatabase.ConnectionString))
        {
            string query = "SELECT COUNT(1) FROM Suppliers WHERE SupplierID = @id";

            using (var cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();

                int count = Convert.ToInt32(cmd.ExecuteScalar());
                return count > 0;
            }
        }
    }

    internal static SupplierListItemDto GetSupplierById(int id)
    {
        using (var conn = new SqlConnection(NorthwindDatabase.ConnectionString))
        {
            string query = @"
SELECT 
    S.SupplierID,
    s.CompanyName,
    s.ContactName,
    s.ContactTitle,
    s.Address,
    s.City,
    s.Region,
    s.PostalCode,
    s.Country,
    s.Phone,
    s.Fax
FROM Suppliers s
            Where SupplierID=@id";

            using (var cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@id", id);

                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    if (!reader.Read())
                        return null;   // Not found


                    return new SupplierListItemDto
                    {
                        SupplierID = reader["SupplierID"].ToString(),
                        CompanyName = reader["CompanyName"].ToString(),
                        ContactName = reader["ContactName"].ToString(),
                        ContactTitle = reader["ContactTitle"].ToString(),
                        Address = reader["Address"].ToString(),
                        City = reader["City"].ToString(),
                        Region = reader["Region"].ToString(),
                        PostalCode = reader["PostalCode"].ToString(),
                        Country = reader["Country"].ToString(),
                        Phone = reader["Phone"] != DBNull.Value
                               ? reader["Phone"].ToString()
                                : string.Empty,
                        Fax = reader["Fax"] != DBNull.Value
                               ? reader["Fax"].ToString()
                               : string.Empty
                    };
                }
            }
        }
    }

   
}
