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
        const res = await fetch(`http://localhost:5093/api/employees/${id}`);
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

  // Submit update request
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5093/api/employees/${id}`, {
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
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Edit Employee</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          name="firstName"
          value={employee.firstName || ""}
          onChange={handleChange}
        />

        <label>Last Name:</label>
        <input
          name="lastName"
          value={employee.lastName || ""}
          onChange={handleChange}
        />

        <label>Title:</label>
        <input
          name="title"
          value={employee.title || ""}
          onChange={handleChange}
        />

        <label>City:</label>
        <input
          name="city"
          value={employee.city || ""}
          onChange={handleChange}
        />

        <label>Country:</label>
        <input
          name="country"
          value={employee.country || ""}
          onChange={handleChange}
        />

        <br />
        <button type="submit" style={{ marginTop: "15px" }}>
          Update Employee
        </button>
      </form>
    </div>
  );
}
