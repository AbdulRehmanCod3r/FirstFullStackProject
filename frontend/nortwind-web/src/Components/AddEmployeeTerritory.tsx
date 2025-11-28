import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployeeTerritory: React.FC = () => {
  const navigate = useNavigate();

  const [employeeID, setEmployeeID] = useState("");
  const [territoryID, setTerritoryID] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newData = {
      employeeID: Number(employeeID),
      territoryID,
    };

    const response = await fetch("https://localhost:7035/EmployeeTerritories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });

    if (response.ok) {
      alert("Employee Territory added!");
      navigate("/employee-territories");
    } else {
      alert("Failed to create Employee Territory");
    }

    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h3>Add Employee Territory</h3>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="number"
            className="form-control"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Territory ID</label>
          <input
            type="text"
            className="form-control"
            value={territoryID}
            onChange={(e) => setTerritoryID(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-success" disabled={loading}>
          {loading ? "Adding..." : "Add Employee Territory"}
        </button>

        <button
          className="btn btn-secondary ms-2"
          type="button"
          onClick={() => navigate("/employee-territories")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEmployeeTerritory;
