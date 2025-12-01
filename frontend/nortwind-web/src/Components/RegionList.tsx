import React, { useEffect, useState } from "react";
import { type Region } from "../api/Region";
import { useNavigate } from "react-router-dom";

const RegionList: React.FC = () => {
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const loadRegions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://localhost:7035/Region");
        const data = await response.json();
        setRegions(data);
        setCurrentPage(1);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
        setRegions(null);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  const deleteRegion = async (id: number | undefined) => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this region?")) {
      try {
        await fetch(`https://localhost:7035/Region/${id}`, { method: "DELETE" });

        setRegions(regions?.filter(r => r.regionID !== id) || []);

      } catch (err) {
        console.error(err);
        alert("Failed to delete region. Check console.");
      }
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = regions?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = regions ? Math.ceil(regions.length / recordsPerPage) : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Regions</h5>
            <small className="text-muted">Fetched from API</small>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-region")}
          >
            + Add New Region
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading regions...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ID</th>
                <th>Region Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                currentRecords.map(region => (
                  <tr key={region.regionID}>
                    <td>{region.regionID}</td>
                    <td>{region.regionDescription ?? "-"}</td>

                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteRegion(region.regionID)}
                        >
                          Delete
                        </button>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/edit-region/${region.regionID}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && regions && regions.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">
                    No Regions Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && regions && (
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

export default RegionList;
