import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, updateCategory, type Category } from "../api/Category";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Omit<Category, "categoryID">>({
    categoryName: "",
    description: "",   // ✔ fixed
  });

  // Load existing category
  useEffect(() => {
    const loadCategory = async () => {
      const list = await getCategories();
      const category = list.find((c) => c.categoryID === Number(id));

      if (!category) {
        alert("Category not found!");
        navigate("/categories");
        return;
      }

      const { categoryName, description } = category; // ✔ fixed

      setForm({
        categoryName: categoryName ?? "",
        description: description ?? "",  // ✔ fixed
      });

      setLoading(false);
    };

    loadCategory();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateCategory(Number(id), form);
      alert("Category updated successfully!");
      navigate("/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to update category. See console.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h3>Edit Category</h3>

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={form.categoryName}
            onChange={(e) =>
              setForm({ ...form, categoryName: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={form.description}        // ✔ fixed
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })  // ✔ fixed
            }
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Update</button>

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
