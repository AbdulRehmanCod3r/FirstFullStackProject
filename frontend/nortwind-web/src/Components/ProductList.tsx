import { useEffect, useState } from "react"
import { getProducts, type Product } from "../api/Products"
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../api/Products";



function ProductLst() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setProducts(null);
    } finally {
      setLoading(false);
    }
  }


  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = products?.slice(indexOfFirstRecord, indexOfLastRecord) || []
  const totalPages = products ? Math.ceil(products.length / recordsPerPage) : 1

  return (
    <div className="container py-4">
      <div className="table-card">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
          <div>
            <h5 className="mb-0">Products</h5>
            <small className="text-muted">Fetched from API</small>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-product")}
          >
            + Add New Product
          </button>
        </div>

        {error && <p className="text-danger">Error: {error}</p>}
        {loading && <p>Loading products...</p>}

        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="bg-white">
              <tr>
                <th>ProductID</th>
                <th>Product Name</th>
                <th>SupplierID</th>
                <th>CategoryID</th>
                {/* <th>Quantity Per Unit</th> */}
                <th>Unit Price</th>
                <th>Units in Stock</th>
                <th>Units On Order</th>
                <th>Reorder Level</th>
                <th>Discontinued</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                currentRecords.map((p) => (
                  <tr key={p.productID}>
                    <td>{p.productID}</td>
                    <td>{p.productName}</td>
                    <td>{p.supplierID}</td>
                    <td>{p.categoryID}</td>
                    {/* <td>{p.quantityPerUnit}</td> */}
                    <td>${p.unitPrice}</td>
                    <td>{p.unitsInStock}</td>
                    <td>{p.unitsOnOrder}</td>
                    <td>{p.reorderLevel}</td>
                    <td>{p.discontinued ? "Yes" : "No"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete ${p.productName}?`)) {
                              try {
                                await deleteProduct(p.productID);
                                setProducts(products?.filter(prod => prod.productID !== p.productID) || []);
                              } catch (err) {
                                console.error(err);
                                alert("Failed to delete product. Check console.");
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/products/edit/${p.productID}`)}
                        >
                          Edit
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && products && products.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center">
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION BUTTONS */}
        {!loading && products && (
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
  )
}

export default ProductLst
