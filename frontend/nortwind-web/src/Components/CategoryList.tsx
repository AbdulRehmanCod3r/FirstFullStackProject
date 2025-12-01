import { useEffect, useState } from "react";
import { getCategories, deleteCategory, type Category } from "../api/Category";
import { useNavigate } from "react-router-dom";

function CategoryLst() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);

    try {
      const data = await getCategories();
      setCategories(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setCategories(null);
    } finally {
      setLoading(false);
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords =
    categories?.slice(indexOfFirstRecord, indexOfLastRecord) || [];

  const totalPages = categories
    ? Math.ceil(categories.length / recordsPerPage)
    : 1;

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Categories</h5>
            <small className="text-muted">Fetched from API</small>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-category")}
          >
            + Add New Category
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading categories...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>CategoryID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
  {loading ? (
    <tr>
      <td colSpan={4}>Loading...</td>
    </tr>
  ) : categories && categories.length > 0 ? (
    currentRecords.map((c) => (
      <tr key={c.categoryID}>
        <td>{c.categoryID}</td>
        <td>{c.categoryName}</td>
       <td>{c.description || (c as any).descripition}</td>
        <td>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={async () => {
                if (window.confirm(`Delete ${c.categoryName}?`)) {
                  await deleteCategory(c.categoryID);
                  setCategories(prev => prev?.filter(x => x.categoryID !== c.categoryID) || []);
                }
              }}
            >
              Delete
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/categories/edit/${c.categoryID}`)}
            >
              Edit
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center">
        No Categories Found
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

        {/* PAGINATION */}
        {!loading && categories && (
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

export default CategoryLst;
