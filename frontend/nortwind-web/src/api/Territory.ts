export interface Territory {
  territoryID: string;
  territoryDescription: string;
  regionID: string;
}

const BASE = "https://localhost:7035";

// Safe JSON parsing
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

// GET all territories — NO validation
export async function getTerritories(): Promise<Territory[]> {
  return fetchWrapper<Territory[]>(`${BASE}/Territories`, {
    headers: { Accept: "application/json" },
  });
}

// DELETE territory — NO validation
export async function deleteTerritory(territoryID: string): Promise<void> {
  return fetchWrapper<void>(`${BASE}/Territories/${territoryID}`, {
    method: "DELETE",
  });
}

// Validation function
function validateTerritory(t: Territory): string[] {
  const errors: string[] = [];

  if (!t.territoryID || t.territoryID.length > 10)
    errors.push("territoryID must be 1–10 characters long.");

  if (!t.territoryDescription || t.territoryDescription.length > 20)
    errors.push("territoryDescription must be 1–20 characters long.");

  if (!t.regionID || t.regionID.length > 1)
    errors.push("regionID must be 1 characters long.");

  return errors;
}

// ADD territory — validation included
export async function addTerritory(territory: Territory): Promise<Territory> {
  const errors = validateTerritory(territory);
  if (errors.length > 0) throw new Error(errors.join("\n"));

  return fetchWrapper<Territory>(`${BASE}/Territories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(territory),
  });
}

// UPDATE territory — validation included
export async function updateTerritory(
  territoryID: string,
  body: Territory
): Promise<Territory> {
  const errors = validateTerritory(body);
  if (errors.length > 0) throw new Error(errors.join("\n"));

  const res = await fetch(`${BASE}/Territories/${territoryID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error ${res.status}: ${error}`);
  }

  return res.json();
}
