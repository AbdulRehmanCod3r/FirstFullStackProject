import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSupplier, type Supplier } from "../api/Supplier";

export default function AddSupplier() {
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState<Omit<Supplier, "supplierID">>({
        companyName: "",
        contactName: "",
        contactTitle: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
        phone: "",
        fax: "" // Fax field added
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addSupplier(supplier);
            alert("Supplier added successfully!");
            navigate("/suppliers");
        } catch (err) {
            console.error(err);
            alert("Failed to add supplier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h3>Add Supplier</h3>

            <form onSubmit={handleSubmit} className="mt-3">

                {(Object.keys(supplier) as (keyof Supplier)[]).map((key) => (
                    key !== "supplierID" && ( 
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
                    )
                ))}

                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Adding..." : "Add Supplier"}
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
