// EditProduct.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts, updateProduct, type Product } from "../api/Products";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<Omit<Product, "productID">>({
        productName: "",
        supplierID: 0,
        categoryID: 0,
        quantityPerUnit: "",
        unitPrice: 0,
        unitsInStock: 0,
        unitsOnOrder: 0,
        reorderLevel: 0,
        discontinued: false,
    });

    useEffect(() => {
        const loadProduct = async () => {
            const list = await getProducts();
            const product = list.find((p) => p.productID === Number(id));

            if (!product) {
                alert("Product not found!");
                navigate("/products");
                return;
            }

            const {...rest } = product;

            setForm({
                ...rest,
                productName: rest.productName ?? "",
                supplierID: rest.supplierID ?? 0,
                categoryID: rest.categoryID ?? 0,
                quantityPerUnit: rest.quantityPerUnit ?? "",   
                unitPrice: rest.unitPrice ?? 0,
                unitsInStock: rest.unitsInStock ?? 0,
                unitsOnOrder: rest.unitsOnOrder ?? 0,
                reorderLevel: rest.reorderLevel ?? 0,
                discontinued: rest.discontinued ?? false,
            });
            setLoading(false);

        };
        loadProduct();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateProduct(Number(id), form);
            alert("Product updated successfully!");
            navigate("/products");
        } catch (err) {
            console.error(err);
            alert("Failed to update. See console.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container py-4">
            <h3>Edit Product</h3>

            <form onSubmit={handleSubmit} className="mt-3">

                <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.productName}
                        onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Supplier ID</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.supplierID}
                        onChange={(e) => setForm({ ...form, supplierID: Number(e.target.value) })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Category ID</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.categoryID}
                        onChange={(e) => setForm({ ...form, categoryID: Number(e.target.value) })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Quantity Per Unit</label>
                    <input
                        type="text"
                        className="form-control"
                        value={form.quantityPerUnit}
                        required
                        onChange={(e) => setForm({ ...form, quantityPerUnit: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Unit Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.unitPrice}
                        onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Units in Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.unitsInStock}
                        onChange={(e) => setForm({ ...form, unitsInStock: Number(e.target.value) })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Units On Order</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.unitsOnOrder}
                        onChange={(e) => setForm({ ...form, unitsOnOrder: Number(e.target.value) })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Reorder Level</label>
                    <input
                        type="number"
                        className="form-control"
                        value={form.reorderLevel}
                        onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })}
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form.discontinued}
                        onChange={(e) => setForm({ ...form, discontinued: e.target.checked })}
                    />
                    <label className="form-check-label">Discontinued</label>
                </div>

                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/products")}>
                    Cancel
                </button>

            </form>
        </div>
    );
}
