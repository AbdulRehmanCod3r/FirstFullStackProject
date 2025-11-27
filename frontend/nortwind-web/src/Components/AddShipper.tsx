import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Shipper } from "../api/Shipper";

const AddShipper: React.FC = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // NOW include shipperID
    const newShipper: Shipper = {
      companyName,
      phone,
    };

    try {
      const response = await fetch("https://localhost:7035/Shipper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipper),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add shipper:", errorData);
        alert("Failed to add shipper. Check console for details.");
        return;
      }

      alert("Shipper added successfully!");
      navigate("/shippers");
    } catch (err) {
      console.error(err);
      alert("Failed to add shipper. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add New Shipper</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Adding..." : "Add Shipper"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/shippers")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddShipper;
