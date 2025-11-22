using Microsoft.Data.SqlClient;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data;

public class ProductRepository
{
    static string connectionString = @"Data Source=.\SQLEXPRESS;Initial Catalog=NorthwindDb;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;";

    public static int InsertProduct(CreateProductDto dto)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            string query = @"
                    INSERT INTO Products 
                    (
                        ProductName,
                        SupplierID,
                        CategoryID,
                        QuantityPerUnit,
                        UnitPrice,
                        UnitsInStock,
                        UnitsOnOrder,
                        ReorderLevel,
                        Discontinued
                    )
                    VALUES
                    (
                        @ProductName,
                        @SupplierID,
                        @CategoryID,
                        @QuantityPerUnit,
                        @UnitPrice,
                        @UnitsInStock,
                        @UnitsOnOrder,
                        @ReorderLevel,
                        @Discontinued
                    );

                    SELECT SCOPE_IDENTITY();
                    ";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ProductName", dto.ProductName);
                cmd.Parameters.AddWithValue("@SupplierID", dto.SupplierID);
                cmd.Parameters.AddWithValue("@CategoryID", dto.CategoryID);
                cmd.Parameters.AddWithValue("@QuantityPerUnit", dto.QuantityPerUnit);
                cmd.Parameters.AddWithValue("@UnitPrice", dto.UnitPrice);
                cmd.Parameters.AddWithValue("@UnitsInStock", dto.UnitsInStock);
                cmd.Parameters.AddWithValue("@UnitsOnOrder", dto.UnitsOnOrder);
                cmd.Parameters.AddWithValue("@ReorderLevel", dto.ReorderLevel);
                cmd.Parameters.AddWithValue("@Discontinued", dto.Discontinued);

                return Convert.ToInt32(cmd.ExecuteScalar());
            }

        }
    }

    public static int UpdateProducts(int id, UpdateProductDto dto)
    {
        using (var conn = new SqlConnection(connectionString))
        {
            string query =
                "UPDATE Products SET " +
                "ProductName = @ProductName, " +
                "SupplierID = @SupplierID, " +
                "CategoryID = @CategoryID, " +
                "QuantityPerUnit = @QuantityPerUnit, " +
                "UnitPrice = @UnitPrice, " +
                "UnitsInStock = @UnitsInStock, " +
                "UnitsOnOrder = @UnitsOnOrder, " +
                "ReorderLevel = @ReorderLevel, " +
                "Discontinued = @Discontinued " +
                "WHERE ProductID = @ProductID";

            using (var cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ProductID", id);
                cmd.Parameters.AddWithValue("@ProductName", dto.ProductName);
                cmd.Parameters.AddWithValue("@SupplierID", dto.SupplierID);
                cmd.Parameters.AddWithValue("@CategoryID", dto.CategoryID);
                cmd.Parameters.AddWithValue("@QuantityPerUnit", dto.QuantityPerUnit);
                cmd.Parameters.AddWithValue("@UnitPrice", dto.UnitPrice);
                cmd.Parameters.AddWithValue("@UnitsInStock", dto.UnitsInStock);
                cmd.Parameters.AddWithValue("@UnitsOnOrder", dto.UnitsOnOrder);
                cmd.Parameters.AddWithValue("@ReorderLevel", dto.ReorderLevel);
                cmd.Parameters.AddWithValue("@Discontinued", dto.Discontinued);

                conn.Open();
                return cmd.ExecuteNonQuery();   // returns number of rows updated
            }
        }


    }

    public static void DeleteProduct(int ProductId)
    {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            string query = "DELETE FROM Products WHERE ProductId = @ProductID";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@ProductID", ProductId);
                cmd.ExecuteNonQuery();
            }
        }
    }

    public static List<ProductListItemDto> GetAllProducts()
    {
        var products = new List<ProductListItemDto>();

        string query = @"
SELECT 
    p.ProductID,
    p.ProductName,
    p.SupplierID,
    s.CompanyName AS SupplierName,
    p.CategoryID,
    c.CategoryName,
    p.QuantityPerUnit,
    p.UnitPrice,
    p.UnitsInStock,
    p.UnitsOnOrder,
    p.ReorderLevel,
    p.Discontinued
FROM Products p
INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
INNER JOIN Categories c ON p.CategoryID = c.CategoryID;
";

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            using (SqlCommand cmd = new SqlCommand(query, conn))
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    products.Add(new ProductListItemDto
                    {
                        ProductID = Convert.ToInt32(reader["ProductID"]),
                        ProductName = reader["ProductName"].ToString(),
                        SupplierID = Convert.ToInt32(reader["SupplierID"]),
                        CategoryID = Convert.ToInt32(reader["CategoryID"]),

                        SupplierName = reader["SupplierName"].ToString(),
                        CategoryName = reader["CategoryName"].ToString(),

                        UnitPrice = reader["UnitPrice"] != DBNull.Value
                                    ? Convert.ToDecimal(reader["UnitPrice"])
                                    : 0,

                        UnitsInStock = reader["UnitsInStock"] != DBNull.Value
                                    ? Convert.ToInt16(reader["UnitsInStock"])
                                    : (short)0,

                        UnitsOnOrder = reader["UnitsOnOrder"] != DBNull.Value
                                    ? Convert.ToInt16(reader["UnitsOnOrder"])
                                    : (short)0,

                        ReorderLevel = reader["ReorderLevel"] != DBNull.Value
                                    ? Convert.ToInt16(reader["ReorderLevel"])
                                    : (short)0,

                        Discontinued = reader["Discontinued"] != DBNull.Value
                                    && Convert.ToBoolean(reader["Discontinued"])
                    });
                }
            }
        }

        return products;
    }

    public static bool IsExists(int id)
    {
        using (var conn = new SqlConnection(connectionString))
        {
            string query = "SELECT COUNT(1) FROM Products WHERE ProductID = @id";

            using (var cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();

                int count = Convert.ToInt32(cmd.ExecuteScalar());
                return count > 0;
            }
        }
    }

    internal static ProductListItemDto GetProductById(int id)
    {
        using (var conn = new SqlConnection(connectionString))
        {
            string query = @"
SELECT 
    p.ProductID,
    p.ProductName,
    p.SupplierID,
    s.CompanyName AS SupplierName,
    p.CategoryID,
    c.CategoryName,
    p.QuantityPerUnit,
    p.UnitPrice,
    p.UnitsInStock,
    p.UnitsOnOrder,
    p.ReorderLevel,
    p.Discontinued
FROM Products p
INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID
INNER JOIN Categories c ON p.CategoryID = c.CategoryID
WHERE ProductID = @id";

            using (var cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@id", id);

                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    if (!reader.Read())
                        return null;   // Not found


                    return new ProductListItemDto
                    {
                        ProductID = Convert.ToInt32(reader["ProductID"]),
                        ProductName = reader["ProductName"].ToString(),
                        SupplierID = Convert.ToInt32(reader["SupplierID"]),
                        CategoryID = Convert.ToInt32(reader["CategoryID"]),

                        SupplierName = reader["SupplierName"].ToString(),
                        CategoryName = reader["CategoryName"].ToString(),

                        UnitPrice = reader["UnitPrice"] != DBNull.Value
                                    ? Convert.ToDecimal(reader["UnitPrice"])
                                    : 0,

                        UnitsInStock = reader["UnitsInStock"] != DBNull.Value
                                    ? Convert.ToInt16(reader["UnitsInStock"])
                                    : (short)0,

                        UnitsOnOrder = reader["UnitsOnOrder"] != DBNull.Value
                                    ? Convert.ToInt16(reader["UnitsOnOrder"])
                                    : (short)0,

                        ReorderLevel = reader["ReorderLevel"] != DBNull.Value
                                    ? Convert.ToInt16(reader["ReorderLevel"])
                                    : (short)0,

                        Discontinued = reader["Discontinued"] != DBNull.Value
                                    && Convert.ToBoolean(reader["Discontinued"])
                    };
                }
            }
        }
    }
}
