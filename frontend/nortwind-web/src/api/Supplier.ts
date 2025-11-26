export interface Supplier {
  supplierID?: number;  
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  fax: string;
}

const BASE = "https://localhost:7035/Supplier";

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(BASE);
  return await res.json();
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const res = await fetch(`${BASE}/${id}`);
  return await res.json();
}

export async function addSupplier(supplier: Omit<Supplier, "supplierID">) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplier),
  });
  return res.json();
}

export async function updateSupplier(id: number, supplier: Supplier) {
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supplier),
  });
}

export async function deleteSupplier(id: number) {
  return fetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
