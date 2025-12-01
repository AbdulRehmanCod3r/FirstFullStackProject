import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Territory {
territoryID: number;
territoryDescription: string;
regionID: string;
}

const EditTerritory: React.FC = () => {
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();

const [territory, setTerritory] = useState<Territory>({
territoryID: 0,
territoryDescription: "",
regionID: "",
});

const [loading, setLoading] = useState(true);

useEffect(() => {
if (!id) return;
const fetchTerritory = async () => {
try {
const response = await fetch(`https://localhost:7035/Territories/${id}`);
if (!response.ok) {
alert("Territory not found!");
navigate("/territory");
return;
}
const data = await response.json();
setTerritory({
territoryID: data.territoryID,
territoryDescription: data.territoryDescription?.trim() || "",
regionID: String(data.regionID).trim(),
});
} catch (err) {
console.error(err);
alert("Failed to load territory. See console.");
} finally {
setLoading(false);
}
};
fetchTerritory();
}, [id, navigate]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setTerritory({ ...territory, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!id) return;


setLoading(true);
try {
  const response = await fetch(
    `https://localhost:7035/Territories/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dto: {
          territoryDescription: territory.territoryDescription.trim(),
          regionID: territory.regionID.trim(),
        },
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json();
    console.error("Update failed", errData);
    alert("Failed to update territory.");
    return;
  }

  alert("Territory updated successfully!");
  navigate("/territory");
} catch (err) {
  console.error(err);
  alert("Failed to update territory. See console.");
} finally {
  setLoading(false);
}


};

if (loading) return <p>Loading territory...</p>;

return ( <div className="container py-4"> <h3>Edit Territory</h3> <form onSubmit={handleSubmit} className="mt-3"> <div className="mb-3"> <label className="form-label">Territory Description</label> <input
         type="text"
         className="form-control"
         name="territoryDescription"
         value={territory.territoryDescription}
         onChange={handleChange}
         required
       /> </div>


    <div className="mb-3">
      <label className="form-label">Region ID</label>
      <input
        type="text"
        className="form-control"
        name="regionID"
        value={territory.regionID}
        onChange={handleChange}
        required
      />
    </div>

    <button type="submit" className="btn btn-success" disabled={loading}>
      {loading ? "Updating..." : "Update Territory"}
    </button>

    <button
      type="button"
      className="btn btn-secondary ms-2"
      onClick={() => navigate("/territory")}
    >
      Cancel
    </button>
  </form>
</div>


);
};

export default EditTerritory;
