export interface Product {
  productID: number;
  productName: string;
  supplierID: number;
  categoryID: number;
  quantityPerUnit: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
  reorderLevel: number;
  discontinued: boolean;
}

const BASE = "https://localhost:7035";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/Products`, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Products API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as Product[];
  return data;
}

// ADD Product
export async function addProduct(product: Omit<Product, "productID">): Promise<Product> {
  const response = await fetch(`${BASE}/Products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Backend error:", text);
    throw new Error("Failed to add product");
  }

  return response.json();
}

// DELETE Product
export async function deleteProduct(productID: number): Promise<void> {
  const res = await fetch(`${BASE}/Products/${productID}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
}

// UPDATE product

async function safeJson(res: Response) {
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
export async function updateProduct(productID: number, updatedProduct: Omit<Product, "productID">): Promise<Product> {
  const res = await fetch(`${BASE}/Products/${productID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend Update Error:", text);
    throw new Error("Failed to update product");
  }

  const data = await safeJson(res);
  return data;
}
