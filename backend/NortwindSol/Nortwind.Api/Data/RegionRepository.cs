using Microsoft.Data.SqlClient;
using Nortwind.Api.Dto;

namespace Nortwind.Api.Data
{
    public class RegionRepository
    {
        public string ConnectionString = "Data Source=DESKTOP-S08JF63\\SQLEXPRESS01;Initial Catalog=Northwinddb2;Integrated Security=True;Encrypt=True;Trust Server Certificate=True;";

        public bool AddRegion(CreateRegionDto dto)
        {
            string insertquery = "INSERT INTO Region(RegionID,RegionDescription) VALUES(@RegionID, @RegionDescription)";

            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(insertquery, con))
                {
                    cmd.Parameters.AddWithValue("@RegionID", dto.RegionID);
                    cmd.Parameters.AddWithValue("@RegionDescription", dto.RegionDescription);
                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public List<RegionListItemDto> GetRegion()
        {
            List<RegionListItemDto> Regions = new List<RegionListItemDto>();
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                string selectquery = "select *from Region";
                using (SqlCommand cmd = new SqlCommand(selectquery, con))
                {
                    con.Open();
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        Regions.Add(new RegionListItemDto
                        {
                            RegionID = (int)dr["RegionID"],
                            RegionDescription = dr["RegionDescription"]?.ToString()
                            
                        });
                    }
                }
                return Regions;
            }
        }

        public RegionListItemDto GetRegionById(int RegionId)
        {
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                string query = "SELECT * FROM Region WHERE RegionID=@RegionId";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@RegionID", RegionId);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    return new RegionListItemDto
                    {
                        RegionID = (int)dr["RegionID"],
                        RegionDescription = dr["RegionDescription"]?.ToString()
                        
                    };
                }
            }

            return null;
        }
        public void DeleteRegion(int RegionID)
        {
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                con.Open();
                // 4. Finally delete the employee row
                string query = @"DELETE FROM Region 
                        WHERE RegionID = @RegionID";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RegionID", RegionID);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public bool UpdateRegion(int id, UpdateRegionDto Dto)
        {
            using (SqlConnection con = new SqlConnection(ConnectionString))
            {
                string query = "UPDATE Region SET RegionDescription=@RegionDescription  WHERE RegionID = @RegionID";
    
    

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@RegionDescription", Dto.RegionDescription);
                cmd.Parameters.AddWithValue("@RegionID", id);
                con.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }


    }
}
