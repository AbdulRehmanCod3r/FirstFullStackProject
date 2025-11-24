// Products.ts
export interface Product {
  productID: number;
  productName: string;
  supplierID: number;
  categoryID: number;
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

// ADD Products

export async function addProduct(product: any): Promise<Product> {
    const response = await fetch(`${BASE}/Products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error("Failed to add product");
    }

    return response.json();
}
