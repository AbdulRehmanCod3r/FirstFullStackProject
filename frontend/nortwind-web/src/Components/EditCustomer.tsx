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
  // ------------------------------
// VALIDATION HELPERS
// ------------------------------

// 1) CustomerID: 3–5 chars, only letters + digits
const isCustomerIDValid = (value: string) =>
  /^[A-Za-z0-9]{3,5}$/.test(value);

// 2) Alphabet only (with spaces)
const isAlphabetic = (value: string) =>
  /^[A-Za-z\s]+$/.test(value);

// 3) Alphabetic + Max Length
const isAlphabeticWithMax = (value: string, max: number) =>
  /^[A-Za-z\s]+$/.test(value) && value.length <= max;

// 4) Max Length (any characters)
const isMaxLength = (value: string, max: number) =>
  value.length <= max;

// 5) Postal Code (exactly 5 digits)
const isPostalCode = (value: string) =>
  /^[0-9]{5}$/.test(value);

// 6) Country (alphabetic, min 3, max 20)
const isCountryValid = (value: string) =>
  /^[A-Za-z\s]{3,20}$/.test(value);

// 7) Phone format: convert 030014325 → 030-014325
const formatPhone = (value: string) => {
  // remove any non-numeric first
  let cleaned = value.replace(/[^0-9]/g, "");

  if (cleaned.length > 3) {
    return cleaned.slice(0, 3) + "-" + cleaned.slice(3);
  }
  return cleaned;
};

// Phone must be numeric except dash
const isPhoneValid = (value: string) =>
  /^[0-9]{3}-[0-9]+$/.test(value);



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

  // ------------------------------
  // FIELD-BY-FIELD VALIDATION RULES
  // ------------------------------

  if (!isCustomerIDValid(customer.customerID || "")) {
    alert("Customer ID must be 3 to 5 characters (letters + numbers only).");
    return;
  }

  if (!isAlphabetic(customer.companyName) || !isMaxLength(customer.companyName, 20)) {
    alert("Company Name must contain only letters and be max 20 characters.");
    return;
  }

  if (!isAlphabetic(customer.contactName) || !isMaxLength(customer.contactName, 20)) {
    alert("Contact Name must contain only letters and be max 20 characters.");
    return;
  }

  if (!isAlphabeticWithMax(customer.contactTitle, 20)) {
    alert("Contact Title must contain only letters and be max 20 characters.");
    return;
  }

  if (!isMaxLength(customer.address, 55)) {
    alert("Address cannot exceed 55 characters.");
    return;
  }

  if (!isAlphabetic(customer.city) || !isMaxLength(customer.city, 20)) {
    alert("City must contain only letters and be max 20 characters.");
    return;
  }

  if (!isAlphabetic(customer.region || "") || !isMaxLength(customer.region || "", 20)) {
    alert("Region must contain only letters and be max 20 characters.");
    return;
  }

  if (!isPostalCode(customer.postalCode)) {
    alert("Postal Code must be exactly 5 digits.");
    return;
  }

  if (!isCountryValid(customer.country)) {
    alert("Country must contain only letters (min 3, max 20).");
    return;
  }

  // Format phone before saving
  const formattedPhone = formatPhone(customer.phone);

  if (!isPhoneValid(formattedPhone)) {
    alert("Phone number must contain only numbers and use format 030-123456.");
    return;
  }

  // Update with formatted phone
  customer.phone = formattedPhone;

  // ------------------------------
  // IF ALL VALID → PROCEED TO API
  // ------------------------------

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
    alert("Failed to update customer.");
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
