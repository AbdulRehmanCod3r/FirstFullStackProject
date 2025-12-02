import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTerritory, type Territory } from "../api/Territory";

export default function AddTerritory() {
  const navigate = useNavigate();

  const [territoryID, setTerritoryID] = useState("");
  const [territoryDescription, setTerritoryDescription] = useState("");
  const [regionID, setRegionID] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newTerritory: Territory = {
      territoryID,
      territoryDescription,
      regionID,
    };

    try {
      await addTerritory(newTerritory);
      alert("Territory added successfully!");
      navigate("/territory");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add New Territory</h3>

      <form onSubmit={handleSubmit} className="mt-3">
        
        {/* Territory ID */}
        <div className="mb-3">
          <label className="form-label">Territory ID</label>
          <input
            type="text"
            className="form-control"
            value={territoryID}
            maxLength={10}
            onChange={(e) => {
              if (e.target.value.length <=10) setTerritoryID(e.target.value);
            }}
            required
          />
          <small className="text-muted">Max 10 characters</small>
        </div>

        {/* Territory Description */}
        <div className="mb-3">
          <label className="form-label">Territory Description</label>
          <input
            type="text"
            className="form-control"
            value={territoryDescription}
            maxLength={20}
            onChange={(e) => {
              if (e.target.value.length <= 20)
                setTerritoryDescription(e.target.value);
            }}
            required
          />
          <small className="text-muted">Max 20 characters</small>
        </div>

        {/* Region ID */}
        <div className="mb-3">
          <label className="form-label">Region ID</label>
          <input
            type="text"
            className="form-control"
            value={regionID}
            maxLength={1}
            onChange={(e) => {
              if (e.target.value.length <= 1) setRegionID(e.target.value);
            }}
            required
          />
          <small className="text-muted">Max 1 characters</small>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Saving..." : "Add Territory"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/territories")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
