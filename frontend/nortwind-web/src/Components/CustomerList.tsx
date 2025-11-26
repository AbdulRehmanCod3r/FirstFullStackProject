import React, { useEffect, useState } from "react";
import { type Customer } from "../api/Customer";
import { useNavigate } from "react-router-dom";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://localhost:7035/Customers");
        const data = await response.json();
        setCustomers(data);
        setCurrentPage(1);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
        setCustomers(null);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const deleteCustomer = async (id: number | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await fetch(`https://localhost:7035/Customers/${id}`, { method: "DELETE" });
        setCustomers(customers?.filter(cust => cust.customerID !== id) || []);
      } catch (err) {
        console.error(err);
        alert("Failed to delete customer. Check console.");
      }
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = customers?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = customers ? Math.ceil(customers.length / recordsPerPage) : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Customers</h5>
            <small className="text-muted">Fetched from API</small>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-customer")}
          >
            + Add New Customer
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading customers...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Contact Name</th>
                <th>Contact Title</th>
                <th>City</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && currentRecords.map(cust => (
                <tr key={cust.customerID}>
                  <td>{cust.customerID}</td>
                  <td>{cust.companyName}</td>
                  <td>{cust.contactName}</td>
                  <td>{cust.contactTitle}</td>
                  <td>{cust.city}</td>
                  <td>{cust.country}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCustomer(cust.customerID)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/edit-customer/${cust.customerID}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && customers && customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No Customers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && customers && (
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

export default CustomerList;
