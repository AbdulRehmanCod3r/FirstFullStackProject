import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, type Product } from "../api/Products";

export default function AddProduct() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [quantityPerUnit, setQuantityPerUnit] = useState("");  
  const [unitPrice, setUnitPrice] = useState("");
  const [unitsInStock, setUnitsInStock] = useState("");
  const [unitsOnOrder, setUnitsOnOrder] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [discontinued, setDiscontinued] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newProduct: Omit<Product, "productID"> = {
      productName,
      supplierID: parseInt(supplierID),
      categoryID: parseInt(categoryID),
      quantityPerUnit,                                    
      unitPrice: parseFloat(unitPrice),
      unitsInStock: parseInt(unitsInStock),
      unitsOnOrder: parseInt(unitsOnOrder),
      reorderLevel: parseInt(reorderLevel),
      discontinued,
    };

    try {
      await addProduct(newProduct);
      alert("Product Added Successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Supplier ID</label>
          <input
            type="text"
            className="form-control"
            value={supplierID}
            onChange={(e) => setSupplierID(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category ID</label>
          <input
            type="text"
            className="form-control"
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity Per Unit</label>
          <input
            type="text"
            className="form-control"
            value={quantityPerUnit}
            onChange={(e) => setQuantityPerUnit(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Unit Price</label>
          <input
            type="number"
            className="form-control"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Units in Stock</label>
          <input
            type="number"
            className="form-control"
            value={unitsInStock}
            onChange={(e) => setUnitsInStock(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Units on Order</label>
          <input
            type="number"
            className="form-control"
            value={unitsOnOrder}
            onChange={(e) => setUnitsOnOrder(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Reorder Level</label>
          <input
            type="number"
            className="form-control"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={discontinued}
            onChange={(e) => setDiscontinued(e.target.checked)}
            id="discontinuedCheck"
          />
          <label className="form-check-label" htmlFor="discontinuedCheck">
            Discontinued
          </label>
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/products")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
