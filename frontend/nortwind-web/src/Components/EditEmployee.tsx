import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Employee } from "../api/Employee";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch employee data by ID
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`https://localhost:7035/employees/${id}`);
        if (!res.ok) throw new Error("Employee not found");

        const data: Employee = await res.json();
        setEmployee(data);
        setLoading(false);
      } catch (error) {
        setMessage("Error fetching employee");
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  // Update form fields
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (!employee) return;
    setEmployee({ ...employee, [name]: value });
  }
  // NOTE: This function needs to handle fields that might be dates (like BirthDate)
  // or numbers if you expand the form, but for basic text fields, it's fine.

  // Submit update request
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(""); // Clear previous message
    if (!employee) return;

    try {
      const res = await fetch(`https://localhost:7035/Employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!res.ok) throw new Error("Failed to update employee");

      setMessage("Employee updated successfully!");
      setTimeout(() => navigate("/employees"), 1200);
    } catch (error) {
      setMessage("Error updating employee");
    }
  }

  if (loading) return <p>Loading employee...</p>;

  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="container py-4">
      <h2>Edit Employee: {employee.employeeID}</h2>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* EMPLOYEE ID (read-only) */}
        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="text"
            className="form-control"
            value={employee.employeeID}
            readOnly
          />
        </div>

        {/* LAST NAME */}
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={employee.lastName || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* FIRST NAME */}
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={employee.firstName || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* TITLE */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={employee.title || ""}
            onChange={handleChange}
          />
        </div>

        {/* CITY */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={employee.city || ""}
            onChange={handleChange}
          />
        </div>
        
        {/* COUNTRY */}
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={employee.country || ""}
            onChange={handleChange}
          />
        </div>
        
        {/* HOME PHONE (If applicable in your Employee type) */}
        {/*
        <div className="mb-3">
          <label className="form-label">Home Phone</label>
          <input
            type="text"
            className="form-control"
            name="homePhone"
            value={employee.homePhone || ""}
            onChange={handleChange}
          />
        </div>
        */}

        <button type="submit" className="btn btn-success" disabled={loading}>
          Update Employee
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/employees")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}