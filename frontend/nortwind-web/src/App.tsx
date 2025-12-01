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
import CategoryList from './Components/CategoryList';
import AddCategory from './Components/AddCategory';
import EditCategory from './Components/EditCategory';


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

               <Route path="/category" element={<CategoryList />} />
              <Route path="/add-category" element={<AddCategory />} />
             <Route path="/categories/edit/:id" element={<EditCategory />} />


            </Routes>
          </div>
        </div>

      </div>
    </Router>
  )
}

export default App
