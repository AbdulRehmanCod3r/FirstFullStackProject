import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Shipper } from "../api/Shipper";

const ShipperList: React.FC = () => {
  const [shippers, setShippers] = useState<Shipper[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const loadShippers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://localhost:7035/Shipper");
        const data = await response.json();
        setShippers(data);
        setCurrentPage(1);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
        setShippers(null);
      } finally {
        setLoading(false);
      }
    };

    loadShippers();
  }, []);

  const deleteShipper = async (id: number | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this shipper?")) {
      try {
        await fetch(`https://localhost:7035/Shipper/${id}`, { method: "DELETE" });
        setShippers(shippers?.filter(shipper => shipper.shipperID !== id) || []);
      } catch (err) {
        console.error(err);
        alert("Failed to delete shipper. Check console.");
      }
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = shippers?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = shippers ? Math.ceil(shippers.length / recordsPerPage) : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Shippers</h5>
            <small className="text-muted">Fetched from API</small>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-shipper")}
          >
            + Add New Shipper
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading shippers...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ID</th>
                <th>Company Name</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && currentRecords.map(shipper => (
                <tr key={shipper.shipperID}>
                  <td>{shipper.shipperID}</td>
                  <td>{shipper.companyName}</td>
                  <td>{shipper.phone}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteShipper(shipper.shipperID)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/edit-shipper/${shipper.shipperID}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && shippers && shippers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No Shippers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && shippers && (
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

export default ShipperList;
