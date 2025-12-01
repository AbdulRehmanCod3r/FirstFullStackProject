export interface Territory {
territoryID: string;
territoryDescription: string;
regionID: string;
}

const BASE = "https://localhost:7035";

// Safe JSON parsing with empty response handling
async function safeJson<T>(res: Response): Promise<T> {
const text = await res.text();
if (!text) return {} as T;
try {
return JSON.parse(text) as T;
} catch (err) {
console.warn("Invalid JSON response:", text);
return {} as T;
}
}

// Generic fetch wrapper
async function fetchWrapper<T>(url: string, options?: RequestInit): Promise<T> {
const res = await fetch(url, options);
if (!res.ok) {
const text = await res.text();
throw new Error(`API Error ${res.status}: ${text}`);
}
return safeJson<T>(res);
}

// GET all territories
export async function getTerritories(): Promise<Territory[]> {
return fetchWrapper<Territory[]>(`${BASE}/Territories`, {
headers: { Accept: "application/json" },
});
}

// ADD territory (backend expects camelCase fields)
export async function addTerritory(territory: Territory): Promise<Territory> {
return fetchWrapper<Territory>(`${BASE}/Territories`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(territory),
});
}

// DELETE territory
export async function deleteTerritory(territoryID: string): Promise<void> {
await fetchWrapper<void>(`${BASE}/Territories/${territoryID}`, {
method: "DELETE",
});
}
// UPDATE territory
export async function updateTerritory(territoryID: number, body: any) {
  const res = await fetch(`/Territories/${territoryID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error ${res.status}: ${error}`);
  }

  return await res.json();
}
