import React from "react";
import MainLayout from "./components/layout/MainLayout";
import AddUser from "./components/views/adduser/AddUser";
import Dashboard from "./components/views/dashboard/Dashboard";

import Login from "./components/views/login/Login";
import Brands from "./components/views/product/Brands";
import Product from "./components/views/product/Product";

import MyProfile from "./components/views/adduser/MyProfile";
import CustomerList from "./components/views/customer/CustomerList";
import Invoice from "./components/views/invoice/Invoice";
import InvoiceList from "./components/views/invoice/InvoiceList";
import Pos from "./components/views/pos/Pos";
import ProductCategories from "./components/views/product/ProductCategories";
import CreateBrand from "./components/views/product/product_sub/CreateBrand";
import CreateProduct from "./components/views/product/product_sub/CreateProduct";
import CreateProductCategory from "./components/views/product/product_sub/CreateProductCategory";
import DummySales from "./components/views/sale/DummySales";
import DummySalesList from "./components/views/sale/DummySalesList";
import Sales from "./components/views/sale/Sales";
import SalesList from "./components/views/sale/SalesList";
import SalesNew from "./components/views/sale/SalesNew";
import SalesTableFormat from "./components/views/sale/SalesTableFormat";
import Store from "./components/views/store/Store";

const routes = [
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "product", element: <Product /> },
      { path: "sales", element: <SalesTableFormat /> },
      { path: "sales1", element: <Sales /> },
      { path: "salesList", element: <SalesList /> },
      { path: "productCategories", element: <ProductCategories /> },
      { path: "brands", element: <Brands /> },
      { path: "product/create_product", element: <CreateProduct /> },
      { path: "adduser", element: <AddUser /> },
      { path: "store", element: <Store /> },

      {
        path: "productCategories/create_productcategory",
        element: <CreateProductCategory />,
      },
      { path: "brands/create_brand", element: <CreateBrand /> },
      { path: "dummySales", element: <DummySales /> },
      { path: "dummySalesList", element: <DummySalesList /> },
      { path: "salesNew", element: <SalesNew /> },
      { path: "profile", element: <MyProfile /> },
      { path: "customer", element: <CustomerList /> },
      { path: "invoice", element: <Invoice /> },
      { path: "invoiceList", element: <InvoiceList /> }
    ],
  },
  {
    path: "/app1/pos/",
    element: <Pos />,
  },
  {
    path: "/",
    element: <Login />,
  },
];
export default routes;
