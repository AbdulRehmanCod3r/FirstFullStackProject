import React, { useState } from "react";
import type { Employee } from "../api/Employee";
import { useNavigate } from "react-router-dom";

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Employee>>({
    firstName: "",
    lastName: "",
    title: "",
    titleOfCourtesy: "",
    birthDate: "",
    hireDate: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    homePhone: "",
    extension: "",
    notes: "",
    reportsTo: null,
    photoPath: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://localhost:7035/Employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      alert("Employee Added Successfully!");
      navigate("/employees");
    } else {
      alert("Failed to add employee.");
    }
  };

  return (
    <div className="container py-4">
      <h4>Add New Employee</h4>

      <form onSubmit={handleSubmit} className="mt-4">

        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Title Of Courtesy</label>
            <input
              type="text"
              name="titleOfCourtesy"
              value={form.titleOfCourtesy || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Hire Date</label>
            <input
              type="date"
              name="hireDate"
              value={form.hireDate || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Region</label>
            <input
              type="text"
              name="region"
              value={form.region || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              value={form.country || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Home Phone</label>
            <input
              type="text"
              name="homePhone"
              value={form.homePhone || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Reports To (ID)</label>
            <input
              type="number"
              name="reportsTo"
              value={form.reportsTo || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              className="form-control"
            ></textarea>
          </div>

        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Save Employee
        </button>
        <button
          type="button"
          className="btn btn-secondary mt-3 ms-2"
          onClick={() => navigate("/employees")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
