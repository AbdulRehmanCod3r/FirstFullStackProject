using Microsoft.Data.SqlClient;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class TerritoriesRepository
    {
        static string connectionString = @"Data Source=.\SQLEXPRESS;Initial Catalog=NorthwindDb;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;";

        public static void InsertTeritory(CreateTerritoryDto dto)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"
                    INSERT INTO Territories
                    (
                        TerritoryID,
                        TerritoryDescription,
                        RegionID
                    )
                    VALUES
                    (
                        @TerritoryID,
                        @TerritoryDescription,
                        @RegionID
                    );

                    ";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TerritoryID", dto.TerritoryID);
                    cmd.Parameters.AddWithValue("@TerritoryDescription", dto.TerritoryDescription);
                    cmd.Parameters.AddWithValue("@RegionID", dto.RegionID);

                    cmd.ExecuteScalar();
                }

            }
        }

        public static int UpdateTerritory(UpdateTerritoryDto dto)
        {
            using (var conn = new SqlConnection(connectionString))
            {
                string query =
                    "UPDATE Territories SET " +
                    "TerritoryID = @TerritoryID, " + 
                    "TerritoryDescription = @TerritoryDescription, " +
                    "RegionID = @RegionID ";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TerritoryID",dto.TerritoryID);
                    cmd.Parameters.AddWithValue("@TerritoryDescription", dto.TerritoryDescription);
                    cmd.Parameters.AddWithValue("@RegionID", dto.RegionID);

                    conn.Open();
                    return cmd.ExecuteNonQuery();   // returns number of rows updated
                }
            }


        }

        public static void DeleteTerritory(int TerritoryID)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "DELETE FROM Territories WHERE TerritoryID = @TerritoryID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TerritoryID", TerritoryID);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public static List<TerritoryListItemDto> GetAllTerritory()
        {
            var Territory = new List<TerritoryListItemDto>();

            string query = @"
SELECT 
    t.TerritoryID,
    t.TerritoryDescription,
    t.RegionID
from Territories t
";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Territory.Add(new TerritoryListItemDto
                        {
                            TerritoryID = Convert.ToInt32(reader["TerritoryID"]),
                            TerritoryDescription = reader["TerritoryDescription"].ToString(),
                            RegionID =Convert.ToInt32(reader["RegionID"])

                        });
                    }
                }
            }

            return Territory;
        }

        public static bool IsExists(int id)
        {
            using (var conn = new SqlConnection(connectionString))
            {
                string query = "SELECT COUNT(1) FROM Territories WHERE TerritoryID= @id";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();

                    int count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count > 0;
                }
            }
        }

        internal static TerritoryListItemDto GetTerritoryById(int id)
        {
            using (var conn = new SqlConnection(connectionString))
            {
                string query = @"
                   SELECT 
                       t.TerritoryID,
                       t.TerritoryDescription,
                       t.RegionID
                   FROM Territories t
                   WHERE TerritoryID = @id";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.Read())
                            return null;   // Not found


                        return new TerritoryListItemDto
                        {
                            TerritoryID = Convert.ToInt32(reader["TerritoryID"]),
                            TerritoryDescription = reader["TerritoryDescription"].ToString(),
                            RegionID = Convert.ToInt32(reader["RegionID"])
                        };
                    }
                }
            }
        }
    }
}
