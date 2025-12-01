using Microsoft.Data.SqlClient;
using Nortwind.Api.Constants;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class CategoryRepository
    {
        public static int InsertCategory(CreateCategoryDto dto)
        {
            using (SqlConnection conn = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                conn.Open();
                string query = @"
                    INSERT INTO Categories
                    (
                        CategoryName,
                        Description
                    )
                    VALUES
                    (
                        @CategoryName,
                        @Description 
                    );

                    SELECT SCOPE_IDENTITY();
                    ";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@CategoryName", dto.CategoryName);
                    cmd.Parameters.AddWithValue("@Description", dto.Description);

                    return Convert.ToInt32(cmd.ExecuteScalar());
                }

            }
        }

        public static int UpdateCategory(int id, UpdateCategoryDto dto)
        {
            using (var conn = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string query =
                    "UPDATE Categories SET " +
                    "CategoryName= @CategoryName, " +
                    "Description = @Description " +
                    "where CategoryID = @CategoryID";


                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@CategoryID", id);
                    cmd.Parameters.AddWithValue("@CategoryName", dto.CategoryName);
                    cmd.Parameters.AddWithValue("@Description", dto.Description);

                    conn.Open();
                    return cmd.ExecuteNonQuery();   // returns number of rows updated
                }
            }


        }

        public static void DeleteCategories(int CategoryID)
        {
            using (SqlConnection conn = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                conn.Open();
                string query = "DELETE FROM Categories WHERE CategoryID = @CategoryID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@CategoryID", CategoryID);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public static List<CategoryListItemDto> GetAllCategory()
        {
            var Category = new List<CategoryListItemDto>();

            string query = @"
SELECT 
    c.CategoryID,
    c.CategoryName,
    c.Description
from Categories c
";

            using (SqlConnection conn = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Category.Add(new CategoryListItemDto
                        {
                            CategoryID = Convert.ToInt32(reader["CategoryID"]),
                            CategoryName = reader["CategoryName"].ToString(),
                            Descripition = reader["Description"].ToString()

                        });
                    }
                }
            }

            return Category;
        }

        public static bool IsExists(int id)
        {
            using (var conn = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string query = "SELECT COUNT(1) FROM Categories WHERE CategoryID = @id";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();

                    int count = Convert.ToInt32(cmd.ExecuteScalar());
                    return count > 0;
                }
            }
        }

        internal static CategoryListItemDto GetCategoryById(int id)
        {
            using (var conn = new SqlConnection(NorthwindDatabase.ConnectionString))
            {
                string query = @"
                   SELECT 
                       c.CategoryID,
                       c.CategoryName,
                       c.Description
                   FROM Categories c
                   WHERE CategoryID = @id";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (!reader.Read())
                            return null;   // Not found


                        return new CategoryListItemDto
                        {
                            CategoryID = Convert.ToInt32(reader["CategoryID"]),
                            CategoryName = reader["CategoryName"].ToString(),
                            Descripition = reader["Description"].ToString()
                        };
                    }
                }
            }
        }
        
    }
}
