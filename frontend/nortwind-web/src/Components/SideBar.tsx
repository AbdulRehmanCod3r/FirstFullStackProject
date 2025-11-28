import React from "react";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <a href="#" className="text-nowrap logo-img mt-3"></a>
        </div>

        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/products">
                <i className="ti ti-layout-dashboard"></i>
                <span className="hide-menu">Product List</span>
              </Link>
            </li>

            <li className="sidebar-item">
              <Link className="sidebar-link" to="/suppliers">
                <i className="ti ti-users"></i>
                <span className="hide-menu">Supplier List</span>
              </Link>
            </li>

            <li className="sidebar-item">
              <Link className="sidebar-link" to="/customers">
                <i className="ti ti-user"></i>
                <span className="hide-menu">Customer List</span>
              </Link>
            </li>

            <li className="sidebar-item">
              <Link className="sidebar-link" to="/employees">
                <i className="ti ti-user"></i>
                <span className="hide-menu">Employee List</span>
              </Link>
            </li>

            <li className="sidebar-item">
              <Link className="sidebar-link" to="/shippers">
                <i className="ti ti-user"></i>
                <span className="hide-menu">Shipper List</span>
              </Link>
            </li>
        <li className="sidebar-item">
              <Link className="sidebar-link" to="/regions">
                <i className="ti ti-user"></i>
                <span className="hide-menu">Region List</span>
              </Link>
            </li>
<li className="sidebar-item">
              <Link className="sidebar-link" to="/employee-territories">
                <i className="ti ti-user"></i>
                <span className="hide-menu">EmployeeTerritories List</span>
              </Link>
            </li>


          </ul>
        </nav>
      </div>
    </aside>
  );
}


export default SideBar;

