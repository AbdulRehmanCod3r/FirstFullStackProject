import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTerritories,
  deleteTerritory,
  type Territory,
} from "../api/Territory";

export default function TerritoryList() {
  const navigate = useNavigate();

  const [territories, setTerritories] = useState<Territory[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchTerritories();
  }, []);

  async function fetchTerritories() {
    setLoading(true);
    setError(null);
    try {
      const data = await getTerritories();
      setTerritories(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setTerritories(null);
    } finally {
      setLoading(false);
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords =
    territories?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = territories
    ? Math.ceil(territories.length / recordsPerPage)
    : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Territories</h5>
            <small className="text-muted">Fetched from API</small>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-territory")}
          >
            + Add New Territory
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading territories...</p>}

        {/* Table */}
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Region ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                currentRecords.map((t) => (
                  <tr key={t.territoryID}>
                    <td>{t.territoryID}</td>
                    <td>{t.territoryDescription}</td>
                    <td>{t.regionID}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            navigate(`/edit-territory/${t.territoryID}`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Delete territory ${t.territoryDescription}?`
                              )
                            ) {
                              try {
                                await deleteTerritory(t.territoryID);
                                setTerritories(
                                  territories?.filter(
                                    (x) => x.territoryID !== t.territoryID
                                  ) || []
                                );
                              } catch (err) {
                                console.error(err);
                                alert("Failed to delete territory.");
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && territories && territories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    No Territories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && territories && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
