import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployeeTerritory: React.FC = () => {
  const { id } = useParams(); // territoryID
  const navigate = useNavigate();

  const [employeeID, setEmployeeID] = useState("");
  const [territoryID, setTerritoryID] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`https://localhost:7035/EmployeeTerritories/${id}`);
        const data = await res.json();

        // Normalize possible API casing differences
        const empId = data.employeeID ?? data.EmployeeID;
        const terrId = data.territoryID ?? data.TerritoryID;

        setEmployeeID(empId != null ? String(empId) : "");
        setTerritoryID(terrId ?? "");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load employee territory:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData = {
      employeeID: Number(employeeID),
      territoryID,
    };

    const res = await fetch(`https://localhost:7035/EmployeeTerritories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      alert("Updated successfully!");
      navigate("/employee-territories");
    } else {
      alert("Failed to update record");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h3>Edit Employee Territory</h3>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="number"
            className="form-control"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Territory ID</label>
          <input
            type="text"
            className="form-control"
            value={territoryID}
            onChange={(e) => setTerritoryID(e.target.value)}
          />
        </div>

        <button className="btn btn-success">Update</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/employee-territories")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditEmployeeTerritory;
