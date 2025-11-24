import './App.css'
import Header from './Components/Header'
import SideBar from './Components/SideBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductList from './Components/ProductLst'
import EmployeeList from './Components/EmployeeList'
import CustomerList from './Components/CustomerList'
import AddProduct from './Components/AddProduct'

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
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/customers" element={<CustomerList />} />
            </Routes>
          </div>
        </div>

      </div>
    </Router>
  )
}

export default App
