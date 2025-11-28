import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type EmployeeTerritory } from "../api/EmployeeTerritories"; // ✅ fixed import

const EmployeeTerritoryList: React.FC = () => {
  const [list, setList] = useState<EmployeeTerritory[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Load data from API
  const loadData = async () => {
    try {
      const response = await fetch("https://localhost:7035/EmployeeTerritories");
      const data = await response.json();

      // Normalize API response keys (in case backend returns EmployeeID/TerritoryID)
      const normalized = (data as any[]).map((d) => ({
        employeeID: d.employeeID ?? d.EmployeeID,
        territoryID: d.territoryID ?? d.TerritoryID,
      }));

      setList(normalized as EmployeeTerritory[]);
    } catch (err) {
      console.error("Failed to load employee territories:", err);
      setList([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (employeeID: number, territoryID: string) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await fetch(
      `https://localhost:7035/EmployeeTerritories/${employeeID}/${territoryID}`,
      { method: "DELETE" }
    );

    // Update list locally
    setList(list?.filter(
      x => !(x.employeeID === employeeID && x.territoryID === territoryID)
    ) || []);
  } catch (err) {
    console.error(err);
    alert("Failed to delete EmployeeTerritory.");
  }
};

  // Filtered list for search
  const filteredList = list.filter((x) => (x.territoryID ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container py-4">
      <h3>Employee Territories</h3>

      {/* Top bar: Add button + search box */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <button className="btn btn-primary" onClick={() => navigate("/employee-territories/add")}>
          + Add Employee Territory
        </button>

        <input
          type="text"
          placeholder="Search by Territory ID..."
          className="form-control w-25"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Employee ID</th>
            <th>Territory ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredList.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center">
                No records found.
              </td>
            </tr>
          )}

          {filteredList.map((item) => (
            <tr key={`${item.employeeID}-${item.territoryID}`}>
              <td>{item.employeeID}</td>
              <td>{item.territoryID}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate(`/employee-territories/edit/${item.territoryID}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                 onClick={() => {
  if (item.employeeID != null && item.territoryID != null) {
    handleDelete(item.employeeID, item.territoryID);
  } else {
    alert("Invalid EmployeeID or TerritoryID");
  }
}}

                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTerritoryList;
