using Microsoft.Data.SqlClient;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class OrderRepository
    {
        private static readonly string connectionString =
            @"Data Source=.\SQLEXPRESS;Initial Catalog=NORTHWIND;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;";

        // ------------------- INSERT ORDER -------------------
        public static int InsertOrder(CreateOrderDto dto)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();
            using var transaction = conn.BeginTransaction();
            try
            {
                string insertOrderQuery = @"
                    INSERT INTO Orders
                    (CustomerID, EmployeeID, OrderDate, RequiredDate,
                     ShipVia, [Shipping Cost], ShipName, ShipAddress, ShipCity,
                     ShipRegion, ShipPostalCode, ShipCountry)
                    VALUES
                    (@CustomerID, @EmployeeID, @OrderDate, @RequiredDate,
                     @ShipVia, @Freight, @ShipName, @ShipAddress, @ShipCity,
                     @ShipRegion, @ShipPostalCode, @ShipCountry);
                    SELECT SCOPE_IDENTITY();
                ";

                using var cmd = new SqlCommand(insertOrderQuery, conn, transaction);
                cmd.Parameters.AddWithValue("@CustomerID", dto.CustomerID);
                cmd.Parameters.AddWithValue("@EmployeeID", (object?)dto.EmployeeID ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@OrderDate", (object?)dto.OrderDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@RequiredDate", (object?)dto.RequiredDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipVia", (object?)dto.ShipVia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Freight", (object?)dto.Freight ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipName", (object?)dto.ShipName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipAddress", (object?)dto.ShipAddress ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipCity", (object?)dto.ShipCity ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipRegion", (object?)dto.ShipRegion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipPostalCode", (object?)dto.ShipPostalCode ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipCountry", (object?)dto.ShipCountry ?? DBNull.Value);

                int newOrderId = Convert.ToInt32(cmd.ExecuteScalar());

                string insertDetailQuery = @"
                    INSERT INTO [Order Details] (OrderID, ProductID, UnitPrice, Quantity, Discount)
                    VALUES (@OrderID, @ProductID, @UnitPrice, @Quantity, @Discount);
                ";

                foreach (var d in dto.OrderDetails)
                {
                    using var dcmd = new SqlCommand(insertDetailQuery, conn, transaction);
                    dcmd.Parameters.AddWithValue("@OrderID", newOrderId);
                    dcmd.Parameters.AddWithValue("@ProductID", d.ProductID);
                    dcmd.Parameters.AddWithValue("@UnitPrice", d.UnitPrice);
                    dcmd.Parameters.AddWithValue("@Quantity", d.Quantity);
                    dcmd.Parameters.AddWithValue("@Discount", d.Discount);
                    dcmd.ExecuteNonQuery();
                }

                transaction.Commit();
                return newOrderId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        // ------------------- GET ALL ORDERS -------------------
        public static List<OrderListItemDto> GetAllOrders()
        {
            var list = new List<OrderListItemDto>();
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
                SELECT O.OrderID, O.CustomerID, O.EmployeeID, O.OrderDate, O.RequiredDate,
                       O.ShipVia, O.[Shipping Cost] AS Freight, O.ShipName, O.ShipAddress, O.ShipCity,
                       O.ShipRegion, O.ShipPostalCode, O.ShipCountry,
                       OD.ProductID, OD.UnitPrice, OD.Quantity, OD.Discount
                FROM Orders O
                LEFT JOIN [Order Details] OD ON O.OrderID = OD.OrderID
                ORDER BY O.OrderID DESC;
            ";

            using var cmd = new SqlCommand(query, conn);
            using var r = cmd.ExecuteReader();

            OrderListItemDto? currentOrder = null;
            int lastOrderId = -1;

            while (r.Read())
            {
                int orderId = (int)r["OrderID"];
                if (orderId != lastOrderId)
                {
                    currentOrder = new OrderListItemDto
                    {
                        OrderID = orderId,
                        CustomerID = r["CustomerID"].ToString(),
                        EmployeeID = r["EmployeeID"] != DBNull.Value ? (int?)r["EmployeeID"] : null,
                        OrderDate = r["OrderDate"] != DBNull.Value ? (DateTime?)r["OrderDate"] : null,
                        RequiredDate = r["RequiredDate"] != DBNull.Value ? (DateTime?)r["RequiredDate"] : null,
                        ShipVia = r["ShipVia"] != DBNull.Value ? (int?)r["ShipVia"] : null,
                        Freight = r["Freight"] != DBNull.Value ? (decimal?)r["Freight"] : null,
                        ShipName = r["ShipName"]?.ToString(),
                        ShipAddress = r["ShipAddress"]?.ToString(),
                        ShipCity = r["ShipCity"]?.ToString(),
                        ShipRegion = r["ShipRegion"]?.ToString(),
                        ShipPostalCode = r["ShipPostalCode"]?.ToString(),
                        ShipCountry = r["ShipCountry"]?.ToString(),
                        OrderDetails = new List<OrderDetailDto>()
                    };
                    list.Add(currentOrder);
                    lastOrderId = orderId;
                }

                if (r["ProductID"] != DBNull.Value)
                {
                    currentOrder!.OrderDetails.Add(new OrderDetailDto
                    {
                        ProductID = (int)r["ProductID"],
                        UnitPrice = (decimal)r["UnitPrice"],
                        Quantity = (short)r["Quantity"],
                        Discount = Convert.ToSingle(r["Discount"])
                    });
                }
            }

            return list;
        }

        // ------------------- GET ORDER BY ID -------------------
        public static OrderListItemDto? GetOrderById(int id)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = @"
                SELECT O.OrderID, O.CustomerID, O.EmployeeID, O.OrderDate, O.RequiredDate,
                       O.ShipVia, O.[Shipping Cost] AS Freight, O.ShipName, O.ShipAddress, O.ShipCity,
                       O.ShipRegion, O.ShipPostalCode, O.ShipCountry,
                       OD.ProductID, OD.UnitPrice, OD.Quantity, OD.Discount
                FROM Orders O
                LEFT JOIN [Order Details] OD ON O.OrderID = OD.OrderID
                WHERE O.OrderID = @OrderID;
            ";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@OrderID", id);

            using var r = cmd.ExecuteReader();
            OrderListItemDto? order = null;

            while (r.Read())
            {
                if (order == null)
                {
                    order = new OrderListItemDto
                    {
                        OrderID = (int)r["OrderID"],
                        CustomerID = r["CustomerID"].ToString(),
                        EmployeeID = r["EmployeeID"] != DBNull.Value ? (int?)r["EmployeeID"] : null,
                        OrderDate = r["OrderDate"] != DBNull.Value ? (DateTime?)r["OrderDate"] : null,
                        RequiredDate = r["RequiredDate"] != DBNull.Value ? (DateTime?)r["RequiredDate"] : null,
                        ShipVia = r["ShipVia"] != DBNull.Value ? (int?)r["ShipVia"] : null,
                        Freight = r["Freight"] != DBNull.Value ? (decimal?)r["Freight"] : null,
                        ShipName = r["ShipName"]?.ToString(),
                        ShipAddress = r["ShipAddress"]?.ToString(),
                        ShipCity = r["ShipCity"]?.ToString(),
                        ShipRegion = r["ShipRegion"]?.ToString(),
                        ShipPostalCode = r["ShipPostalCode"]?.ToString(),
                        ShipCountry = r["ShipCountry"]?.ToString(),
                        OrderDetails = new List<OrderDetailDto>()
                    };
                }

                if (r["ProductID"] != DBNull.Value)
                {
                    order.OrderDetails.Add(new OrderDetailDto
                    {
                        ProductID = (int)r["ProductID"],
                        UnitPrice = (decimal)r["UnitPrice"],
                        Quantity = (short)r["Quantity"],
                        Discount = Convert.ToSingle(r["Discount"])
                    });
                }
            }

            return order;
        }

        // ------------------- UPDATE ORDER -------------------
        public static bool UpdateOrder(int orderId, UpdateOrderDto dto)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();
            using var transaction = conn.BeginTransaction();
            try
            {
                string updateOrderQuery = @"
                    UPDATE Orders
                    SET CustomerID=@CustomerID, EmployeeID=@EmployeeID, OrderDate=@OrderDate,
                        RequiredDate=@RequiredDate, ShipVia=@ShipVia, [Shipping Cost]=@Freight,
                        ShipName=@ShipName, ShipAddress=@ShipAddress, ShipCity=@ShipCity,
                        ShipRegion=@ShipRegion, ShipPostalCode=@ShipPostalCode, ShipCountry=@ShipCountry
                    WHERE OrderID=@OrderID;
                ";

                using var cmd = new SqlCommand(updateOrderQuery, conn, transaction);
                cmd.Parameters.AddWithValue("@OrderID", orderId);
                cmd.Parameters.AddWithValue("@CustomerID", dto.CustomerID);
                cmd.Parameters.AddWithValue("@EmployeeID", (object?)dto.EmployeeID ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@OrderDate", (object?)dto.OrderDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@RequiredDate", (object?)dto.RequiredDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipVia", (object?)dto.ShipVia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Freight", (object?)dto.Freight ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipName", (object?)dto.ShipName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipAddress", (object?)dto.ShipAddress ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipCity", (object?)dto.ShipCity ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipRegion", (object?)dto.ShipRegion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipPostalCode", (object?)dto.ShipPostalCode ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ShipCountry", (object?)dto.ShipCountry ?? DBNull.Value);
                cmd.ExecuteNonQuery();

                // Delete old details
                using var deleteCmd = new SqlCommand("DELETE FROM [Order Details] WHERE OrderID=@OrderID", conn, transaction);
                deleteCmd.Parameters.AddWithValue("@OrderID", orderId);
                deleteCmd.ExecuteNonQuery();

                // Insert new details
                string insertDetailQuery = @"
                    INSERT INTO [Order Details] (OrderID, ProductID, UnitPrice, Quantity, Discount)
                    VALUES (@OrderID, @ProductID, @UnitPrice, @Quantity, @Discount);
                ";

                foreach (var d in dto.OrderDetails)
                {
                    using var dcmd = new SqlCommand(insertDetailQuery, conn, transaction);
                    dcmd.Parameters.AddWithValue("@OrderID", orderId);
                    dcmd.Parameters.AddWithValue("@ProductID", d.ProductID);
                    dcmd.Parameters.AddWithValue("@UnitPrice", d.UnitPrice);
                    dcmd.Parameters.AddWithValue("@Quantity", d.Quantity);
                    dcmd.Parameters.AddWithValue("@Discount", d.Discount);
                    dcmd.ExecuteNonQuery();
                }

                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }

        // ------------------- DELETE ORDER -------------------
        public static bool DeleteOrder(int orderId)
        {
            using var conn = new SqlConnection(connectionString);
            conn.Open();
            using var transaction = conn.BeginTransaction();
            try
            {
                using var deleteDetailsCmd = new SqlCommand("DELETE FROM [Order Details] WHERE OrderID=@OrderID", conn, transaction);
                deleteDetailsCmd.Parameters.AddWithValue("@OrderID", orderId);
                deleteDetailsCmd.ExecuteNonQuery();

                using var deleteOrderCmd = new SqlCommand("DELETE FROM Orders WHERE OrderID=@OrderID", conn, transaction);
                deleteOrderCmd.Parameters.AddWithValue("@OrderID", orderId);
                deleteOrderCmd.ExecuteNonQuery();

                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }
    }
}
