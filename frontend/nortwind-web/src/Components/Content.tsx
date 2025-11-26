// import { useEffect, useState } from "react"
// import { getProducts, type Product } from "../api/Products"

// function Content() {

//     const [products, setProducts] = useState<Product[] | null>(null)
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         fetchProducts()
//     }, [])

//     async function fetchProducts() {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await getProducts();
//             setProducts(data);
//         } catch (err: unknown) {
//             if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError("Unknown error");
//             }
//             setProducts(null);
//         } finally {
//             setLoading(false);
//         }
//     }


//     return (
//         <div className="container py-4">
//             <div className="table-card">
//                 <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-3">
//                     <div>
//                         <h5 className="mb-0">Products</h5>
//                         <small className="text-muted">Fetched from API</small>
//                     </div>

//                     <button className="btn btn-primary btn-sm" onClick={fetchProducts} disabled={loading}>
//                         {loading ? "Loading..." : "Refresh"}
//                     </button>
//                 </div>

//                 {error && <p className="text-danger">Error: {error}</p>}
//                 {loading && <p>Loading products...</p>}

//                 <div className="table-responsive">
//                     <table className="table align-middle table-hover">
//                         <thead className="bg-white">
//                             <tr>
//                                 <th>ProductID</th>
//                                 <th>Product Name</th>
//                                 <th>SupplierID</th>
//                                 <th>CategoryID</th>
//                                 <th>Unit Price</th>
//                                 <th>Units in Stock</th>
//                                 <th>Units On Order</th>
//                                 <th>Reorder Level</th>
//                                 <th>Discontinued</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {!loading && products && products.map((p) => (
//                                 <tr key={p.productID}>
//                                     <td>{p.productID}</td>
//                                     <td>{p.productName}</td>
//                                     <td>{p.supplierID}</td>
//                                     <td>{p.categoryID}</td>
//                                     <td>${p.unitPrice}</td>
//                                     <td>{p.unitsInStock}</td>
//                                     <td>{p.unitsOnOrder}</td>
//                                     <td>{p.reorderLevel}</td>
//                                     <td>{p.discontinued ? "Yes" : "No"}</td>
//                                     <td>
//                                         <div className="d-flex gap-1">
//                                             <button className="btn btn-sm btn-outline-primary">View</button>
//                                             <button className="btn btn-sm btn-outline-success">Edit</button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}

//                             {!loading && products && products.length === 0 && (
//                                 <tr>
//                                     <td colSpan={10} className="text-center">No Products Found</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Content
