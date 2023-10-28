import AccountCircle from "@mui/icons-material/AccountCircle";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReorderIcon from '@mui/icons-material/Reorder';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StarBorder from "@mui/icons-material/StarBorder";
import StoreIcon from "@mui/icons-material/Store";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import CapitalizedText from "../utilities/CapitalizedText";
import "./topbar.css";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(0)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Topbar() {
  const location = useLocation();
  const menu = [
    { path: "/app/dashboard/", title: "Dashboard" },
    { path: "/app/store/", title: "Store" },
    { path: "/app/product/", title: "Product" },
    { path: "/app/productCategories/", title: "Product Categories" },
    { path: "/app/brands/", title: "Brands" },
    { path: "/app/product/create_product/", title: "Create Product" },
    {
      path: "/app/productCategories/create_productcategory/",
      title: "Create Product Categories",
    },

    { path: "/app/brands/create_brand/", title: "Create Brand" },
    { path: "/app/sales/", title: "Sales" },
    { path: "/app/dummySales/", title: "Sales" },
    { path: "/app/salesList/", title: "Sales List" },
    { path: "/app/salesNew/", title: "Sales" },
    { path: "/app/profile/", title: "My Profile" },
    { path: "/app/invoiceList/", title: "Invoice List" },
    { path: "/app/invoice/", title: "Invoice" },
    { path: "/app/customer/", title: "Customer List" },
  ];

  const [title, setTitle] = React.useState({ path: "", title: "" });
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    setTitle(
      !menu.find((e) => e.path === location.pathname)
        ? { path: "", title: "" }
        : menu.find((e) => e.path === location.pathname)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const matches = useMediaQuery("(min-width:600px)");
  const [anchorEl, setAnchorEl] = React.useState(null);

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
    // {
    //   name: "Estimate",
    //   route: "sales",
    // },
    {
      name: "Estimate",
      route: "salesNew",
    },
    {
      name: "Estimate List",
      route: "salesList",
    },
    // {
    //   name: "Sales",
    //   route: "dummySales",
    // },
    // {
    //   name: "Sales List",
    //   route: "dummySalesList",
    // },
    // {
    //   name: "Sales1",
    //   route: "sales1",
    // },
  ];
  const addUser = () => {
    navigate("/app/adduser/", { replace: true });
    setAnchorEl(null);
  };
  const myProfile = () => {
    navigate("/app/profile/", { replace: true });
    setAnchorEl(null);
  };
  const logout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickNestedMenu = () => {
    setOpenNestedMenu(!openNestedMenu);
  };
  const handleClickNestedMenu1 = () => {
    setOpenNestedMenu1(!openNestedMenu1);
  };
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openNestedMenu, setOpenNestedMenu] = React.useState(true);
  const [openNestedMenu1, setOpenNestedMenu1] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenNestedMenu(true);
    setOpenNestedMenu1(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            {title.title}
          </Typography>
          <Box sx={{ marginLeft: "auto", display: "flex" }}>
            <RouterLink to={"/app1/pos/"}>
              <PointOfSaleIcon sx={{ mt: 1, mr: 4 }} />
            </RouterLink>
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              <CapitalizedText text={userData.userName} />
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {userData.storeID === 0 && (
                <MenuItem onClick={addUser}>Add User</MenuItem>
              )}
              <MenuItem onClick={myProfile}>Profile</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" variant={"permanent"} open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"Dashboard"} disablePadding>
            <RouterLink to={"/app/dashboard/"}>
              <ListItemButton
              onClick={handleDrawerClose}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </RouterLink>
          </ListItem>
          {open ? (
            <>
              <ListItemButton>
                <ListItemIcon>
                  <AddShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Product" />
                {openNestedMenu ? (
                  <ExpandLess onClick={handleClickNestedMenu} />
                ) : (
                  <ExpandMore onClick={handleClickNestedMenu} />
                )}
              </ListItemButton>
              <Collapse in={openNestedMenu} timeout="auto" unmountOnExit>
                {productSubMenu.map((txt, i) => {
                  return (
                    <>
                      <RouterLink to={`/app/${txt.route}/`}>
                        <List onClick={handleDrawerClose} component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary={txt.name} />
                          </ListItemButton>
                        </List>
                      </RouterLink>
                    </>
                  );
                })}
              </Collapse>
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingBagIcon />
                </ListItemIcon>
                <ListItemText primary="Sales" />

                {openNestedMenu1 ? (
                  <ExpandLess onClick={handleClickNestedMenu1} />
                ) : (
                  <ExpandMore onClick={handleClickNestedMenu1} />
                )}
              </ListItemButton>
              <Collapse in={openNestedMenu1} timeout="auto" unmountOnExit>
                {salesSubMenu.map((txt, i) => {
                  return (
                    <>
                      <RouterLink to={`/app/${txt.route}/`}>
                        <List onClick={handleDrawerClose} component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                              <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary={txt.name} />
                          </ListItemButton>
                        </List>
                      </RouterLink>
                    </>
                  );
                })}
              </Collapse>
            </>
          ) : (
            <>
              <ListItemButton
                sx={{
                  justifyContent: open ? "initial" : "center",
                }}
                className={matches ? "dropdown" : ""}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                  class="dropbtn"
                >
                  <div class="dropdown-content">
                    {productSubMenu.map((txt, i) => {
                      return (
                        <>
                          <RouterLink to={`/app/${txt.route}/`}>
                            <Typography>{txt.name}</Typography>
                          </RouterLink>
                        </>
                      );
                    })}
                  </div>
                  <AddShoppingCartIcon />
                </ListItemIcon>
              </ListItemButton>
              <ListItemButton
                sx={{
                  justifyContent: open ? "initial" : "center",
                }}
                className={matches ? "dropdown" : ""}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                  class="dropbtn"
                >
                  <div class="dropdown-content">
                    {salesSubMenu.map((txt, i) => {
                      return (
                        <>
                          <RouterLink to={`/app/${txt.route}/`}>
                            <Typography>{txt.name}</Typography>
                          </RouterLink>
                        </>
                      );
                    })}
                  </div>
                  <ShoppingBagIcon />
                </ListItemIcon>
              </ListItemButton>
            </>
          )}
          {userData.storeID === 0 && (
            <ListItem key={"Store"} disablePadding>
              <RouterLink to={`/app/store/`}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Store"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </RouterLink>
            </ListItem>
          )}
          <ListItem key={"Customer"} disablePadding>
            <RouterLink to={"/app/customer/"}>
              <ListItemButton
              onClick={handleDrawerClose}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SupportAgentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Customer"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </RouterLink>
          </ListItem>
          <ListItem key={"Invoice"} disablePadding>
            <RouterLink to={"/app/invoice/"}>
              <ListItemButton
              onClick={handleDrawerClose}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Invoice"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </RouterLink>
          </ListItem>
          <ListItem key={"Invoice List"} disablePadding>
            <RouterLink to={"/app/invoiceList/"}>
              <ListItemButton
              onClick={handleDrawerClose}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <ReorderIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Invoice List"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </RouterLink>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
