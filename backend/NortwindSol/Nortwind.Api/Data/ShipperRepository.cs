using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Nortwind.Api.Constants;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class ShipperRepository
    {
        public static int InsertShipper(CreateShipperDto dto)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {

                con.Open();
                string query = "INSERT INTO Shippers(ShipperID,CompanyName,Phone)VALUES(@ShipperID,@CompanyName,@Phone);";


                using (SqlCommand cmd = new SqlCommand(query, con))
                {

                    cmd.Parameters.AddWithValue("@ShipperID", dto.ShipperID);
                    cmd.Parameters.AddWithValue("@CompanyName", dto.CompanyName);
                    cmd.Parameters.AddWithValue("@Phone", dto.Phone);
                    return Convert.ToInt32(cmd.ExecuteScalar());

                }
            }
        }

        public static int UpdateShipper(int ShipperID, UpdateShipperDto dto)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {

                string query = "\r\nUPDATE Shippers\r\nSET CompanyName = @CompanyName,\r\n    Phone = @Phone\r\nWHERE ShipperID = @ShipperID;";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {

                    cmd.Parameters.AddWithValue("ShipperID", ShipperID);
                    cmd.Parameters.AddWithValue("CompanyName", dto.CompanyName);
                    cmd.Parameters.AddWithValue("Phone", dto.Phone);

                    con.Open();
                    return cmd.ExecuteNonQuery();

                }



            }



        }
        public static void DeleteShipper(int ShipperID)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                con.Open();

                string query = "DELETE FROM Shippers WHERE ShipperID = @ShipperID;";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {

                    cmd.Parameters.AddWithValue("ShipperID", ShipperID);
                    cmd.ExecuteNonQuery();


                }

            }


        }

        public static List<ShipperListItemDto> GetAllShipper()
        {

            var Shipper = new List<ShipperListItemDto>();
            string query = @"
SELECT 
    s.ShipperID,
    s.CompanyName,
    s.Phone
    
FROM Shippers s";
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(query, con))

                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        Shipper.Add(new ShipperListItemDto
                        {
                            ShipperID = Convert.ToInt32(reader["ShipperID"]),
                            CompanyName = reader["CompanyName"].ToString(),
                            Phone = reader["Phone"].ToString()
                        });
                    }
                }
            }
            return Shipper;
        }

        public static ShipperListItemDto GetShipperById(int ShipperID)
        {
            using (SqlConnection con = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string query = @"
SELECT 
    s.ShipperID,
    s.CompanyName,
    s.Phone
    
FROM Shippers s";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {

                    cmd.Parameters.AddWithValue("@ShipperID", ShipperID);
                    con.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.Read())
                            return null;
                        return new ShipperListItemDto
                        {
                            ShipperID = Convert.ToInt32(reader["ShipperID"]),
                            CompanyName = reader["CompanyName"].ToString(),
                            Phone = reader["Phone"].ToString()


                        };

                    }





                }





            }


        }


        public static bool IsExists(int ShipperID)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                string query = "SELECT COUNT(1)\r\nFROM Shippers\r\nWHERE ShipperID = ShipperID;";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@ShipperID", ShipperID);
                    conn.Open();

                    int count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count > 0;
                }
            }
        }



    }
}

