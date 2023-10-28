import React, { useEffect, useState } from "react";
import "./mainHeader.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Menu, MenuItem, Typography, createStyles, lighten } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";


const userData = JSON.parse(sessionStorage.getItem("userData"));
const useStyles = makeStyles((theme) =>
  createStyles({
    link: {
      textDecoration: "none",
    },
    highlighted: {
      backgroundColor: lighten(green[500], 0.5),
    },
  })
);

export default function MainHeader() {
  const s = useStyles();
  const [activeItemIndex, setActiveItemIndex] = useState(1);
  const onclickActive = (e) => {
    alert(e.target.dataset.id);
    if (e.target.dataset.id)
      activeItemIndex === 0 ? setActiveItemIndex(1) : setActiveItemIndex(0);
  };
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };
  const productSubMenu = [
    {
      name: "Product",
      route: "product",
    },
    {
      name: "Product Categories",
      route: "productCategories",
    },
  ];
  const salesSubMenu = [
    {
      name: "Estimate",
      route: "salesNew",
    },
    {
      name: "Estimate List",
      route: "salesList",
    },
  ];
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg main-navbar">
          <form className="form-inline mr-auto">
            <ul className="navbar-nav mr-3">
              {/* <li><a href="#" data-toggle="sidebar" className="nav-link nav-link-lg"><i className="fas fa-bars"></i></a></li> */}
              <li>
                <a
                  href="#"
                  data-toggle="search"
                  className="nav-link nav-link-lg d-sm-none"
                >
                  <i className="fas fa-search"></i>
                </a>
              </li>
            </ul>
            <div className="search-element">
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
                data-width="250"
              />
              <button className="btn" type="submit">
                <i className="fas fa-search"></i>
              </button>
              <div className="search-backdrop"></div>
              <div className="search-result">
                <div className="search-header">Histories</div>
                <div className="search-item">
                  <a href="#">How to Used HTML in Laravel</a>
                  <a href="#" className="search-close">
                    <i className="fas fa-times"></i>
                  </a>
                </div>
                <div className="search-item">
                  <a
                    href="https://themeforest.net/user/admincraft/portfolio"
                    target="_black"
                  >
                    Admincraft Portfolio
                  </a>
                  <a href="#" className="search-close">
                    <i className="fas fa-times"></i>
                  </a>
                </div>
                <div className="search-item">
                  <a href="#">#CodiePie</a>
                  <a href="#" className="search-close">
                    <i className="fas fa-times"></i>
                  </a>
                </div>
                <div className="search-header">Result</div>
                <div className="search-item">
                  <a href="#">
                    <img
                      className="mr-3 rounded"
                      width="30"
                      src="assets/img/products/product-3-50.png"
                      alt="product"
                    />
                    oPhone 11 Pro
                  </a>
                </div>
                <div className="search-item">
                  <a href="#">
                    <img
                      className="mr-3 rounded"
                      width="30"
                      src="assets/img/products/product-2-50.png"
                      alt="product"
                    />
                    Drone Zx New Gen-3
                  </a>
                </div>
                <div className="search-item">
                  <a href="#">
                    <img
                      className="mr-3 rounded"
                      width="30"
                      src="assets/img/products/product-1-50.png"
                      alt="product"
                    />
                    Headphone JBL
                  </a>
                </div>
                <div className="search-header">Projects</div>
                <div className="search-item">
                  <a
                    href="https://themeforest.net/item/epice-laravel-admin-template-for-hr-project-management/24466729"
                    target="_black"
                  >
                    <div className="search-icon bg-danger text-white mr-3">
                      <i className="fas fa-code"></i>
                    </div>
                    Epice Laravel - Admin Template
                  </a>
                </div>
                <div className="search-item">
                  <a
                    href="https://themeforest.net/item/soccer-project-management-admin-template-ui-kit/24646866"
                    target="_black"
                  >
                    <div className="search-icon bg-primary text-white mr-3">
                      <i className="fas fa-laptop"></i>
                    </div>
                    Soccer - Admin Template
                  </a>
                </div>
              </div>
            </div>
          </form>
          <ul className="navbar-nav navbar-right">
            <li className="dropdown dropdown-list-toggle">
            <RouterLink to={"/app1/pos/"}>
            <PointOfSaleIcon sx={{ mt: 1, mr: 4 }} />
              </RouterLink>
              <div className="dropdown-menu dropdown-list dropdown-menu-right">
                <div className="dropdown-header">
                  Notifications
                  <div className="float-right">
                    <a href="#">Mark All As Read</a>
                  </div>
                </div>
                <div className="dropdown-list-content dropdown-list-icons">
                  <a href="#" className="dropdown-item dropdown-item-unread">
                    <div className="dropdown-item-icon bg-primary text-white">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="dropdown-item-desc">
                      {" "}
                      Template update is available now!
                      <div className="time text-primary">2 Min Ago</div>
                    </div>
                  </a>
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-item-icon bg-info text-white">
                      <i className="far fa-user"></i>
                    </div>
                    <div className="dropdown-item-desc">
                      <b>You</b> and <b>Dedik Sugiharto</b> are now friends
                      <div className="time">10 Hours Ago</div>
                    </div>
                  </a>
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-item-icon bg-success text-white">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="dropdown-item-desc">
                      <b>Kusnaedi</b> has moved task <b>Fix bug header</b> to{" "}
                      <b>Done</b>
                      <div className="time">12 Hours Ago</div>
                    </div>
                  </a>
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-item-icon bg-danger text-white">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="dropdown-item-desc">
                      Low disk space. Let's clean it!
                      <div className="time">17 Hours Ago</div>
                    </div>
                  </a>
                  <a href="#" className="dropdown-item">
                    <div className="dropdown-item-icon bg-info text-white">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="dropdown-item-desc">
                      Welcome to CodiePie template!
                      <div className="time">Yesterday</div>
                    </div>
                  </a>
                </div>
                <div className="dropdown-footer text-center">
                  <a href="#">
                    View All <i className="fas fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </li>
            <li className="dropdown">
              <a
                href="#"
                data-toggle="dropdown"
                className="nav-link dropdown-toggle nav-link-lg nav-link-user"
              >
                
                <div className="d-sm-none d-lg-inline-block">
                  Hi, {userData.userName} 
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-right">
              {userData.storeID === 0 && (
              <RouterLink to={"/app/adduser/"} className="dropdown-item has-icon"><i className="far fa-user"></i>Add User</RouterLink>)}
              <RouterLink to={"/app/profile/"} className="dropdown-item has-icon"><i className="far fa-user"></i>Profile</RouterLink>
             
              <Typography onClick={logout} className="dropdown-item has-icon"><i className="fas fa-sign-out-alt"></i>Logout</Typography>
              </div>
            </li>
          </ul>
        </nav>

        <div className="main-sidebar sidebar-style-1">
          <aside id="sidebar-wrapper">
            <div className="sidebar-brand">
              <a href="https://etagers.in" style={{ textTransform: "none" }}>
                eTAGers POS
              </a>
            </div>
            <ul className="sidebar-menu">
              <li className="dropdown">
                <RouterLink className="nav-link" to={"/app/dashboard/"}>
                  <i className="fas fa-fire"></i>
                  <span>Dashboard</span>
                </RouterLink>
              </li>

              <li className="dropdown">
                <a href="#" className="nav-link has-dropdown">
                  <i className="fas fa-columns"></i> <span>Product</span>
                </a>
                <ul className="dropdown-menu">
                  {productSubMenu.map((txt, i) => {
                    return (
                      <>
                        <li>
                          <RouterLink
                            className="nav-link"
                            to={`/app/${txt.route}/`}
                          >
                            {txt.name}{" "}
                          </RouterLink>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </li>
              <li className="dropdown">
                <a href="#" className="nav-link has-dropdown">
                  <i className="fas fa-th"></i> <span>Sales</span>
                </a>
                <ul className="dropdown-menu">
                  {salesSubMenu.map((txt, i) => {
                    return (
                      <>
                        <li>
                          <RouterLink
                            className="nav-link"
                            to={`/app/${txt.route}/`}
                          >
                            {txt.name}{" "}
                          </RouterLink>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </li>
              {userData.storeID === 0 && (<li className="dropdown">
                <RouterLink to={`/app/store/`} className="nav-link">
                  <i className="fas fa-th-large"></i> <span>Store</span>
                </ RouterLink>
              </li>)}
              <li className="dropdown">
              <RouterLink to={"/app/customer/"} className="nav-link">
                  <i className="far fa-file-alt"></i> <span>Customer</span>
                </RouterLink>
              </li>
              <li className="dropdown">
              <RouterLink to={"/app/invoice/"} className="nav-link">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Invoice</span>
                </RouterLink>
              </li>
              <li className="dropdown">
              <RouterLink to={"/app/invoiceList/"} className="nav-link">
                  <i className="far fa-user"></i>
                  <span>Invoice List</span>
                </RouterLink>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
