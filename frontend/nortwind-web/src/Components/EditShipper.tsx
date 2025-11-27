import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Shipper } from "../api/Shipper";

const EditShipper: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shipper, setShipper] = useState<Shipper>({
    shipperID: 0,
    companyName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipper = async () => {
      try {
        const response = await fetch(`https://localhost:7035/Shipper/${id}`);
        if (!response.ok) {
          alert("Shipper not found!");
          navigate("/shippers");
          return;
        }
        const data = await response.json();
        setShipper(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load shipper. See console.");
      } finally {
        setLoading(false);
      }
    };
    fetchShipper();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipper({ ...shipper, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://localhost:7035/Shipper/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipper),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Update failed", errData);
        alert("Failed to update shipper.");
        return;
      }

      alert("Shipper updated successfully!");
      navigate("/shippers");
    } catch (err) {
      console.error(err);
      alert("Failed to update shipper. See console.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading shipper...</p>;

  return (
    <div className="container py-4">
      <h3>Edit Shipper</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control"
            name="companyName"
            value={shipper.companyName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={shipper.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Updating..." : "Update Shipper"}
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

export default EditShipper;
