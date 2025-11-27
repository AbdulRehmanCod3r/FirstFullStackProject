import React, { useEffect, useState } from "react";
import { type Employee } from "../api/Employee";
import { useNavigate } from "react-router-dom";

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://localhost:7035/Employees");
        const data = await response.json();
        setEmployees(data);
        setCurrentPage(1);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
        setEmployees(null);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const deleteEmployee = async (id: number | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await fetch(`https://localhost:7035/Employees/${id}`, { method: "DELETE" });
        setEmployees(employees?.filter(emp => emp.employeeID  !== id) || []);
      } catch (err) {
        console.error(err);
        alert("Failed to delete employee. Check console.");
      }
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = employees?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = employees ? Math.ceil(employees.length / recordsPerPage) : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Employees</h5>
            <small className="text-muted">Fetched from API</small>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/add-employee")}>
            + Add New Employee
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading employees...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Title</th>
                <th>Title Of Courtesy</th>
                <th>Birth Date</th>
                <th>Hire Date</th>
                <th>City</th>
                <th>Region</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                currentRecords.map(emp => (
                  <tr key={emp.employeeID }>
                    <td>{emp.employeeID }</td>
                    <td>{emp.firstName ?? "-"}</td>
                    <td>{emp.lastName ?? "-"}</td>
                    <td>{emp.title ?? "-"}</td>
                    <td>{emp.titleOfCourtesy ?? "-"}</td>
                    <td>{new Date(emp.birthDate).toLocaleDateString()}</td>
                    <td>{new Date(emp.hireDate).toLocaleDateString()}</td>
                    <td>{emp.city ?? "-"}</td>
                    <td>{emp.region ?? "-"}</td>
                    <td>{emp.country ?? "-"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteEmployee(emp.employeeID )}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/edit-employee/${emp.employeeID }`)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && employees && employees.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center">
                    No Employees Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && employees && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
