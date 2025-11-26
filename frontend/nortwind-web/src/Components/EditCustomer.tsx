import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Customer } from "../api/Customer";

const EditCustomer: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer>({
    customerID: "",
    companyName: "",
    contactName: "",
    contactTitle: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`https://localhost:7035/Customers/${id}`);
        if (!response.ok) {
          alert("Customer not found!");
          navigate("/customers");
          return;
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load customer. See console.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://localhost:7035/Customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Update failed", errData);
        alert("Failed to update customer.");
        return;
      }

      alert("Customer updated successfully!");
      navigate("/customers");
    } catch (err) {
      console.error(err);
      alert("Failed to update customer. See console.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading customer...</p>;

  return (
    <div className="container py-4">
      <h3>Edit Customer</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        {/* CUSTOMER ID (read-only) */}
        <div className="mb-3">
          <label className="form-label">Customer ID</label>
          <input
            type="text"
            className="form-control"
            name="customerID"
            value={customer.customerID}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control"
            name="companyName"
            value={customer.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Name</label>
          <input
            type="text"
            className="form-control"
            name="contactName"
            value={customer.contactName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Title</label>
          <input
            type="text"
            className="form-control"
            name="contactTitle"
            value={customer.contactTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={customer.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={customer.city}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Region</label>
          <input
            type="text"
            className="form-control"
            name="region"
            value={customer.region || ""}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Postal Code</label>
          <input
            type="text"
            className="form-control"
            name="postalCode"
            value={customer.postalCode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={customer.country}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Updating..." : "Update Customer"}
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

export default EditCustomer;
