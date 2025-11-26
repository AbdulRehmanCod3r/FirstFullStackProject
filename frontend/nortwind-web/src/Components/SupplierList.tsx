import React, { useEffect, useState } from "react";
import { getSuppliers, deleteSupplier, type Supplier } from "../api/Supplier";
import { useNavigate } from "react-router-dom";

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setSuppliers(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(id);
        setSuppliers(suppliers?.filter(s => s.supplierID !== id) || []);
      } catch (err) {
        console.error(err);
        alert("Failed to delete supplier. Check console.");
      }
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = suppliers?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = suppliers ? Math.ceil(suppliers.length / recordsPerPage) : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Suppliers</h5>
            <small className="text-muted">Fetched from API</small>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/suppliers/add")}
          >
            + Add New Supplier
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading suppliers...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Contact</th>
                <th>City</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading && currentRecords.map(s => (
                <tr key={s.supplierID}>
                  <td>{s.supplierID}</td>
                  <td>{s.companyName}</td>
                  <td>{s.contactName}</td>
                  <td>{s.city}</td>
                  <td>{s.country}</td>
                  <td>{s.phone}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s.supplierID)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/suppliers/edit/${s.supplierID}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && suppliers && suppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No Suppliers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && suppliers && (
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

export default SupplierList;
