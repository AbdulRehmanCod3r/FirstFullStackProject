export interface Region {
  regionID: number;
  regionDescription: string;
}
const API_URL = "https://localhost:7035/Region";

// ✔ GET ALL REGIONS
export async function getAllRegions(): Promise<Region[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch regions");
  return res.json();
}

// ✔ GET REGION BY ID
export async function getRegionById(id: number): Promise<Region> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Region not found");
  return res.json();
}

// ✔ ADD REGION
export async function addRegion(region: { regionId: number, regionDescription: string }): Promise<boolean> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(region),
  });

  return res.ok;
}

// ✔ UPDATE REGION
export async function updateRegion(
  id: number,
  region: { regionDescription: string }
): Promise<boolean> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(region),
  });

  return res.ok;
}

// ✔ DELETE REGION
export async function deleteRegion(id: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return res.ok;
}
