import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCategory, type Category } from "../api/Category";

export default function AddCategory() {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newCategory: Omit<Category, "categoryID"> = {
      categoryName,
      description,   // ✔ spelling fixed
    };

    try {
      await addCategory(newCategory);
      alert("Category Added Successfully!");
      navigate("/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to add category. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/categories")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
