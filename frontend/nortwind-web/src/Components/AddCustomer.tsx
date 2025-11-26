import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Customer } from "../api/Customer";

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();

  const [customerID, setCustomerID] = useState(""); // <-- ADD THIS
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // NOW include customerID
    const newCustomer: Customer = {
      customerID,
      companyName,
      contactName,
      contactTitle,
      address,
      city,
      region,
      postalCode,
      country,
      phone,
    };

    try {
      const response = await fetch("https://localhost:7035/Customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add customer:", errorData);
        alert("Failed to add customer. Check console for details.");
        return;
      }

      alert("Customer added successfully!");
      navigate("/customers");
    } catch (err) {
      console.error(err);
      alert("Failed to add customer. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add New Customer</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        {/* CUSTOMER ID INPUT */}
        <div className="mb-3">
          <label className="form-label">Customer ID</label>
          <input
            type="text"
            className="form-control"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
            required
          />
        </div>

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
          <label className="form-label">Contact Name</label>
          <input
            type="text"
            className="form-control"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Title</label>
          <input
            type="text"
            className="form-control"
            value={contactTitle}
            onChange={(e) => setContactTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Region</label>
          <input
            type="text"
            className="form-control"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Postal Code</label>
          <input
            type="text"
            className="form-control"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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
          {loading ? "Adding..." : "Add Customer"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/customers")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
