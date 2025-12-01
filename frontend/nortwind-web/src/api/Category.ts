// **Category Interface**
export interface Category {
  categoryID: number;
  categoryName: string;
  description: string; // ✔ fixed spelling
}

const BASE = "https://localhost:7035";

// **GET all categories**
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/Category`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Category API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as Category[];
  return data;
}

// **ADD Category**
export async function addCategory(
  category: Omit<Category, "categoryID">
): Promise<Category> {
  const res = await fetch(`${BASE}/Category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category), // ✔ sends "description"
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend Add Error:", text);
    throw new Error("Failed to add category");
  }

  return res.json();
}

// **DELETE Category**
export async function deleteCategory(categoryID: number): Promise<void> {
  const res = await fetch(`${BASE}/Category/${categoryID}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
}

async function safeJson(res: Response) {
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// **UPDATE Category**
export async function updateCategory(
  categoryID: number,
  updatedCategory: Omit<Category, "categoryID">
): Promise<Category> {
  const res = await fetch(`${BASE}/Category/${categoryID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCategory), // ✔ sends "description"
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend Update Error:", text);
    throw new Error("Failed to update category");
  }

  const data = await safeJson(res);
  return data;
}
