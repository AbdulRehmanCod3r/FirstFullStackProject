import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTerritory, type Territory } from "../api/Territory";

export default function AddTerritory() {
  const navigate = useNavigate();

  // Use string values because backend expects strings
  const [territoryID, setTerritoryID] = useState("");
  const [territoryDescription, setTerritoryDescription] = useState("");
  const [regionID, setRegionID] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Must match backend JSON EXACTLY (PascalCase OR camelCase depending on backend)
    const newTerritory: Territory = {
      territoryID: territoryID,
      territoryDescription: territoryDescription,
      regionID: regionID,
    };

    try {
      await addTerritory(newTerritory);
      alert("Territory added successfully!");
      navigate("/territory");
    } catch (err) {
      console.error(err);
      alert("Failed to add territory. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add New Territory</h3>

      <form onSubmit={handleSubmit} className="mt-3">
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

        <div className="mb-3">
          <label className="form-label">Territory Description</label>
          <input
            type="text"
            className="form-control"
            value={territoryDescription}
            onChange={(e) => setTerritoryDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Region ID</label>
          <input
            type="text"
            className="form-control"
            value={regionID}
            onChange={(e) => setRegionID(e.target.value)}
            required
          />
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