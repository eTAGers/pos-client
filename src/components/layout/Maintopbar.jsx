import React, { useEffect, useState } from "react";
import "./mainHeader.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  createStyles,
  lighten,
} from "@mui/material";
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
          </form>
          <ul className="navbar-nav navbar-right">
            <li className="dropdown dropdown-list-toggle">
              <RouterLink to={"/app1/pos/"}>
                <PointOfSaleIcon sx={{ mt: 1, mr: 4 }} />
              </RouterLink>
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
                  <RouterLink
                    to={"/app/adduser/"}
                    className="dropdown-item has-icon"
                  >
                    <i className="far fa-user"></i>Add User
                  </RouterLink>
                )}
                <RouterLink
                  to={"/app/profile/"}
                  className="dropdown-item has-icon"
                >
                  <i className="far fa-user"></i>Profile
                </RouterLink>

                <Typography onClick={logout} className="dropdown-item has-icon">
                  <i className="fas fa-sign-out-alt"></i>Logout
                </Typography>
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
                <a href="#" className="nav-link  has-dropdown">
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
                <a href="#" className="nav-link  has-dropdown">
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
              {userData.storeID === 0 && (
                <li className="dropdown">
                  <RouterLink to={`/app/store/`} className="nav-link">
                    <i className="fas fa-th-large"></i> <span>Store</span>
                  </RouterLink>
                </li>
              )}
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
              <li className="dropdown">
                <RouterLink to={"/app/PO/"} className="nav-link">
                  <i className="far fa-user"></i>
                  <span>PO</span>
                </RouterLink>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
