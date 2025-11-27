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
import { useState } from 'react'

function App() {

  // 👉 sidebar state added here
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div
        className={`page-wrapper ${sidebarOpen ? "toggled" : ""}`}
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >

        {/* Left Sidebar */}
        <SideBar sidebarOpen={sidebarOpen} />

        {/* Content Area */}
        <div className="body-wrapper">
          {/* pass toggle function */}
          <Header setSidebarOpen={setSidebarOpen} />

          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<ProductList />} />
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
            </Routes>
          </div>
        </div>

      </div>
    </Router>
  )
}

export default App
