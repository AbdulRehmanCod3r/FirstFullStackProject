import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSupplierById, updateSupplier, type Supplier } from "../api/Supplier";

export default function EditSupplier() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState<Supplier>({
        supplierID: 0,
        companyName: "",
        contactName: "",
        contactTitle: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
        phone: "",
        fax: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSupplier = async () => {
            try {
                const data = await getSupplierById(Number(id));
                console.log("Supplier data fetched:", data);
                setSupplier(data);
            } catch (error) {
                console.error("Fetch failed:", error);
                alert("Supplier not found!");
                navigate("/suppliers");
            } finally {
                setLoading(false);
            }
        };
        loadSupplier();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateSupplier(Number(id), supplier);
            alert("Supplier updated successfully!");
            navigate("/suppliers");
        } catch (err) {
            console.error(err);
            alert("Update failed.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading supplier...</p>;

    return (
        <div className="container py-4">
            <h3>Edit Supplier</h3>

            <form onSubmit={handleSubmit} className="mt-3">

                {/* Display supplierID as readonly */}
                <div className="mb-3">
                    <label className="form-label">Supplier ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={supplier.supplierID}
                        readOnly
                    />
                </div>

                {(Object.keys(supplier) as (keyof Supplier)[])
                    .filter((key) => key !== "supplierID") // skip ID field
                    .map((key) => (
                        <div className="mb-3" key={key}>
                            <label className="form-label">{key}</label>
                            <input
                                type="text"
                                className="form-control"
                                name={key}
                                value={supplier[key] ?? ""}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Updating..." : "Update Supplier"}
                </button>

                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/suppliers")}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}
