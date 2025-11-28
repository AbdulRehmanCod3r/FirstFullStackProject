import './App.css'
import Header from './Components/Header'
import SideBar from './Components/SideBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductList from './Components/ProductList'
import EmployeeList from './Components/EmployeeList'
import AddProduct from './Components/AddProduct'
import EditProduct from './Components/EditProduct'
import CustomerList from './Components/CustomerList'
import AddCustomer from './Components/AddCustomer'
import EditCustomer from './Components/EditCustomer'
import SupplierList from './Components/SupplierList'
import AddSupplier from './Components/AddSupplier'
import EditSupplier from './Components/EditSupplier'
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import ShipperList from './Components/ShipperList';
import AddShipper from './Components/AddShipper';
import EditShipper from './Components/EditShipper';
import AddRegion from './Components/AddRegion';
import EditRegion from './Components/EditRegion';
import RegionList from './Components/RegionList';
import EmployeeTerritoryList from './Components/EmployeeTerritoryList';
import AddEmployeeTerritory from './Components/AddEmployeeTerritory';
import EditEmployeeTerritory from './Components/EditEmployeeTerritory';


function App() {
  return (
    <Router>
      <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">

        {/* Left Sidebar */}
        <SideBar />

        {/* Content Area */}
        <div className="body-wrapper">
          <Header />
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<ProductList />} /> {/* Default page */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />


              <Route path="/customers" element={<CustomerList />} />
              <Route path="/add-customer" element={<AddCustomer />} />
              <Route path="/edit-customer/:id" element={<EditCustomer />} />

              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/suppliers/add" element={<AddSupplier />} />
              <Route path="/suppliers/edit/:id" element={<EditSupplier />} />

              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/edit-employee/:id" element={<EditEmployee />} />

              <Route path="/shippers" element={<ShipperList />} />
              <Route path="/add-shipper" element={<AddShipper />} />
              <Route path="/edit-shipper/:id" element={<EditShipper />} />

              <Route path="/regions" element={<RegionList />} />
              <Route path="/add-region" element={<AddRegion />} />
              <Route path="/edit-region/:id" element={<EditRegion />} />

              <Route path="/employee-territories" element={<EmployeeTerritoryList />} />
              <Route path="/employee-territories/add" element={<AddEmployeeTerritory />} />
              <Route path="/employee-territories/edit/:id" element={<EditEmployeeTerritory />} />

        



            </Routes>
          </div>
        </div>

      </div>
    </Router>
  )
}

export default App
