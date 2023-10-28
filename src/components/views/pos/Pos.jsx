import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import { Grid } from "@mui/material";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import APIKit from "../../utilities/APIKIT";
import { MESSAGE } from "../../utilities/constant";
import { URLS } from "../../utilities/URLS";
import "./pos.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function Pos(props) {
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 35,
      minHeight: 35,
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: isFocused
        ? "hsla(#0000ff, 64%, 42%, 0.5)"
        : isSelected
        ? "hsla(#0000ff, 64%, 42%, 1)"
        : undefined,
      zIndex: 1,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const [product, setProduct] = useState([]);
  const [productCard, setProductCard] = useState([]);
  const getProduct = async (data = "") => {
    await APIKit.post(URLS.getProduct, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.data);
        setProductCard(res.data.data);
      } else {
      }
    });
  };
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const getCustomer = async (data = "") => {
    await APIKit.get(URLS.getCustomer).then((res) => {
      if (res.data.status === 200) {
        setCustomerList([...res.data.data]);
      } else {
      }
    });
  };
  const getProductByCategory = async (data) => {
    await APIKit.get(URLS.getProductByCategory + "/" + data).then((res) => {
      if (res.data.status === 200) {
        setProductCard(res.data.data);
      } else {
      }
    });
  };
  const [productCategoryData, setProductCategoryData] = useState([]);
  const getProductCategory = async (data = "") => {
    await APIKit.post(URLS.getProductCategory, { searchText: data }).then(
      (res) => {
        if (res.data.status === 200) {
          setProductCategoryData(res.data.data);
        } else {
        }
      }
    );
  };
  useEffect(() => {
    getProduct();
    getProductCategory();
    getCustomer();
  }, []);
  const [details, setDetails] = useState({
    discount: "",
    packingCharge: "",
  });
  const initialValues = {
    productCode: "",
    productName: "",
    productQty: "",
    packingCost: "",
    productID: "",
    isDiscount: true,
  };
  const [salesData, setSalesData] = useState([]);
  function matchProduct(data) {
    console.log(data);
    let item = [...salesData];
    var valueArr = salesData.map(function (item) {
      return item.productID;
    });
    var isDuplicate = valueArr.some((e) => e === data.value);
    if (isDuplicate) {
      variant = "error";
      enqueueSnackbar("This Product Already Added", { variant, anchorOrigin });
      return;
    }
    item.push(initialValues);
    product.map((e) => {
      if (e.productID === data.value) {
        item[item.length - 1].productQty = 1;
        item[item.length - 1].productCode = e.productCode;
        item[item.length - 1].productName = e.productName;
        item[item.length - 1].productCost = e.productCost;
        item[item.length - 1].productID = e.productID;
        setSalesData([...item]);
      }
    });
  }
  function matchProductCard(data) {
    console.log(data);
    let item = [...salesData];
    var valueArr = salesData.map(function (item) {
      return item.productID;
    });
    var isDuplicate = valueArr.some((e) => e === data.productID);
    if (isDuplicate) {
      item[valueArr.indexOf(data.productID)].productQty =
        item[valueArr.indexOf(data.productID)].productQty + 1;
      setSalesData([...item]);
      return;
    }
    item.push(initialValues);
    product.map((e) => {
      if (e.productID === data.productID) {
        item[item.length - 1].productQty = 1;
        item[item.length - 1].productCode = e.productCode;
        item[item.length - 1].productName = e.productName;
        item[item.length - 1].productCost = e.productCost;
        item[item.length - 1].productID = e.productID;
        setSalesData([...item]);
      }
    });
  }

  var userData = JSON.parse(sessionStorage.getItem("userData"));
  const matches = useMediaQuery("(min-width:600px)");
  const [customerDetails, setCustomerDetails] = useState({
    customerID: "",
    name: "",
    mobileNo: "",
    city: "",
  });
  const [isDis, setIsDis] = useState(false);
  const checkCust = async (e) => {
    let item = { ...customerDetails };
    setCustomerList([...customerList]);
    for (var i = 0; i < customerList.length; i++) {
      if (customerList[i].mobileNo === customerDetails.mobileNo) {
        item.customerID = customerList[i].customerID;
        item.name = customerList[i].name;
        item.city = customerList[i].city;
        setIsDis(true);
        setCustomerDetails({
          ...item,
        });
        break;
      } else {
        setIsDis(false);
        item.customerID = "";
        item.name = "";
        item.city = "";
        setCustomerDetails({
          ...item,
        });
      }
    }
    if (item.name === "") {
      variant = "error";
      enqueueSnackbar("Customer details not present", {
        variant,
        anchorOrigin,
      });
      return;
    }
  };
  useEffect(() => {
    let item = { ...customerDetails };
    for (var i = 0; i < customerList.length; i++) {
      if (customerList[i].mobileNo === customerDetails.mobileNo) {
        item.customerID = customerList[i].customerID;
        item.name = customerList[i].name;
        item.city = customerList[i].city;
        setCustomerDetails({
          ...item,
        });
      }
    }
  }, [customerList]);
  const createCustomer = async () => {
    const pay = { ...customerDetails };
    delete pay.customerID;
    if (pay.name === "" || pay.city === "" || pay.mobileNo === "") {
      variant = "error";
      enqueueSnackbar("Mobile, Name and City is Mandatory", {
        variant,
        anchorOrigin,
      });
      return;
    }
    await APIKit.post(URLS.addCustomer, pay).then((res) => {
      if (res.data.status === 200) {
        setIsDis(true);
        getCustomer();

        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };
  const saveSales = async () => {
    const pay = {
      customerID: customerDetails.customerID,
      totalNoofProducts: Number(salesData.length),
      subTotal: String(
        salesData.reduce(
          (a, b) => Number(b.productCost) * Number(b.productQty) + a,
          0
        )
      ),
      discount: Number(details.discount),
      packingCost: Number(details.packingCharge),
      total: String(
        salesData.reduce(
          (a, b) => Number(b.productCost) * Number(b.productQty) + a,
          0
        ) -
          salesData
            .filter((e) => e.isDiscount)
            .reduce(
              (a, b) => Number(b.productCost) * Number(b.productQty) + a,
              0
            ) *
            (Number(details.discount) / 100) +
          Number(details.packingCharge)
      ),
      products: salesData.map((e) => {
        return {
          productName: e.productName,
          productQty: Number(e.productQty),
          productCost: e.productCost,
        };
      }),
    };
    if (pay.customerID === "") {
      variant = "error";
      enqueueSnackbar(MESSAGE.custDetails, { variant, anchorOrigin });
      return;
    }
    if (!salesData.length) {
      variant = "error";
      enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
      return;
    }
    await APIKit.post(URLS.addSales, pay).then((res) => {
      if (res.data.status === 200) {
        setSalesData([]);
        setDetails({
          discount: "",
          packingCharge: "",
        });
        setIsDis(false);
        setCustomerDetails({
          customerID: "",
          name: "",
          mobileNo: "",
          city: "",
        });
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };

  // for fullscreen
  var elem = document.documentElement;
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }
  const print = async () => {
    const pay = {
      customerID: customerDetails.customerID,
      totalNoofProducts: Number(salesData.length),
      subTotal: String(
        salesData.reduce(
          (a, b) => Number(b.productCost) * Number(b.productQty) + a,
          0
        )
      ),
      discount: Number(details.discount),
      packingCost: Number(details.packingCharge),
      total: String(
        salesData.reduce(
          (a, b) => Number(b.productCost) * Number(b.productQty) + a,
          0
        ) -
          salesData
            .filter((e) => e.isDiscount)
            .reduce(
              (a, b) => Number(b.productCost) * Number(b.productQty) + a,
              0
            ) *
            (Number(details.discount) / 100) +
          Number(details.packingCharge)
      ),
      products: salesData.map((e) => {
        return {
          productName: e.productName,
          productQty: Number(e.productQty),
          productCost: e.productCost,
        };
      }),
    };
    if (pay.customerID === "") {
      variant = "error";
      enqueueSnackbar(MESSAGE.custDetails, { variant, anchorOrigin });
      return;
    }
    if (!salesData.length) {
      variant = "error";
      enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
      return;
    }
    await saveSales();
    const html = `
    <html>
<head>
<title>ESTIMATE</title>
<style>
@media print {
    @page {
        margin-top: 0; 
        margin-bottom: 0; 
		margin-left:20px;
		margin-right:20px;
    }
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
}
</style>
</head>
<body style="width: 793px; height:283mm; border: 1px solid black; margin-top:20px; font-family: 'Roboto', sans-serif;">
    <div style="display: flex; width: 100%; padding-bottom:20px;">
        <div style="width:50%; padding-left:30px; padding-top:15px;">
            <div style="font-size:40px; color: #004aab;"><b>ESTIMATE </b></div> 
            <div style="font-size:14px; padding-top:5px;">3/1300/5, Parani Krishna Agencies
                Sivakasi To Sattur Road
                Paraipatti, Sivakasi </div>
            <div style="font-size:14px; padding-top:5px;">Mobile - 76399 47155 </div>
            <div style="font-size:14px; padding-top:5px;">Email - sivakasikarthicrackers@gmail.com </div>
        </div>
		<div style="width:50%; align-self: center; text-align:right; padding-right:30px;">
			<img src="images/logo.jpg" style="width:100px;">
		</div>
	</div>
    <div style="display: flex; width: 100%;">
        <div style="width:100%; padding:0 0px;">
            <div style="border-top: 2px solid #eaeaea;"></div>
        </div> 
	</div>
    <div style="display: flex; width:100%; font-size:14px;">
		<div style=" width:33.3%; padding:20px 40px 20px 40px;">
            <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Date: </b></div> 
            <div style="font-size:14px;">${new Date()
              .toJSON()
              .slice(0, 10)
              .replace(/-/g, "/")} </div> 
		</div>
		<div style=" width:33.3%; padding:20px 40px 20px 40px;">
            <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Estimate No: </b></div> 
            <div style="font-size:14px;">ES 202301</div>
		</div>
        <div style=" width:33.3%; padding:20px 40px 20px 40px; text-align: right;">
            <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Estimate To: </b></div> 
            <div style="font-size:14px;">${customerDetails.name} </div>
            <div style="font-size:14px;">${customerDetails.mobileNo} </div>
            <div style="font-size:14px;">${customerDetails.city} </div>
		</div>
	</div>
    <div style="padding:0 0px;">
        <table style="border-collapse: collapse; width:100%; padding:40px 50px 10px 50px;" class="clr">
            <tr style="font-size:13px; background-color: #004aab; color:#fff;">
                <th style="width:60px; padding: 15px 15px; text-align: center;">S.NO</th>
                <th style="width:60px; padding: 15px 15px; text-align: center;">Product Name</th>
                <th style="width:100px; padding: 15px 15px; text-align: center;">Product Qty</th>
                <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost Per Unit</th>
                <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost</th>
            </tr> 
            ${salesData.map((e, i) => {
              return `
              <tr style="font-size:14px; background:#fff; border-bottom:1px solid #ababab; color: #9d9d9d; padding:5px;">
              <td style="width:60px;  padding:5px; text-align: center;">${
                i + 1
              } </td>
              <td style="width:60px; padding:5px; text-align: center;">${
                e.productName
              }</td>
              <td style="width:100px; padding:5px; text-align: center;">${
                e.productQty
              }</td>
              <td style="width:60px; padding:5px; text-align: center;">${
                e.productCost
              }</td>
              <td style="width:60px; padding:5px; text-align: center;">${
                e.productCost * e.productQty
              }</td>
              </tr>
              `;
            })}
          
            
            <tr style="font-size:14px; background:#fff; color: #004aab;">
                <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Subtotal : </td>
                <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">${salesData.reduce(
                  (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                  0
                )}</td>
            </tr>
            <tr style="font-size:14px; background:#fff; color: #004aab;">
                <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Discount : </td>
                <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">${
                  details.discount
                }%</td>
            </tr>
            <tr style="font-size:14px; background:#fff; color: #004aab;">
            <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Packing Charges (3%) : </td>
            <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">Rs.${
              details.packingCharge
            }</td>
            </tr>
            <tr style="font-size:14px; background:#fff; color: #004aab;">
                <td style="width:100px; padding:5px 15px; text-align: right;" colspan="4">Total : </td>
                <td style="width:10px; padding:5px 25px; text-align: right;" colspan="4">Rs.${
                  salesData.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  ) -
                  salesData.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  ) *
                    (Number(details.discount) / 100) +
                  Number(details.packingCharge)
                }</td>
            </tr>
           
          
            <tr style="background:#004aab; color: #fff;">
                <td style="width:100px; font-size:14px; padding:5px 15px; text-align: left;" colspan="2">Total Items : ${
                  salesData.length
                }</td>
                <td style="width:100px; font-size:14px; padding:5px 15px; text-align: right;" colspan="2">Overall Total : </td>
                <td style="width:120px; font-size:18px; padding:5px 25px; text-align: right;" colspan="2">Rs.${
                  salesData.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  ) -
                  salesData.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  ) *
                    (Number(details.discount) / 100) +
                  Number(details.packingCharge)
                }</td>
            </tr>
        </table>
    </div>
</body>
</html>

`;
    // document.body.innerHTML = html;
    // window.print();
    // document.body.innerHTML = oldPage;
    // window.location.reload();
    var printWindow = window.open("", "", "height=500,width=1000");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div id="pos">
      <Grid container spacing={3} p={1}>
        <Grid item sm={12} md={8} sx={{ overflow: "hidden" }}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={12}>
              <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                  <ArrowBackIcon
                    onClick={() => {
                      navigate("/app/dashboard/", { replace: true });
                    }}
                  />
                </Grid>
                <Grid
                  item
                  sm={12}
                  md={6}
                  alignContent={"flex-end"}
                  display={"flex"}
                  justifyContent={"flex-end"}
                >
                  <FullscreenIcon onClick={openFullscreen} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} md={12}>
              <Select
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                placeholder={"Search Material"}
                onChange={(e) => {
                  matchProduct(e);
                }}
                options={product?.map((e) => {
                  return {
                    value: e.productID,
                    label: e.productName + " (" + e.productCode + ")",
                  };
                })}
              />
            </Grid>
            <Grid item sm={12} md={12}>
              <Card sx={{ minHeight: 135, backgroundColor: "aliceblue" }}>
                <Grid container spacing={1} p={1}>
                  <Grid item sm={12} md={12}>
                    <Box
                      sx={{
                        flexGrow: 1,
                        maxWidth: { xs: "100%", sm: "100%" },
                        bgcolor: "background.paper",
                      }}
                    >
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="visible arrows tabs example"
                        sx={{
                          [`& .${tabsClasses.scrollButtons}`]: {
                            "&.Mui-disabled": { opacity: 0.3 },
                          },
                        }}
                      >
                        <Tooltip title={"All"}>
                          <Tab
                            color="primary"
                            sx={{ whiteSpace: "nowrap" }}
                            onClick={() => getProduct()}
                            label="All"
                          />
                        </Tooltip>
                        {productCategoryData.map((e, index) => {
                          return (
                            <Tooltip
                              title={
                                userData.storeID === 0
                                  ? e.productCategoryName +
                                    "(" +
                                    e.storeName +
                                    ")"
                                  : e.productCategoryName
                              }
                            >
                              <Tab
                                color={e.active ? "primary" : "secondary"}
                                sx={{ whiteSpace: "nowrap" }}
                                onClick={() => {
                                  let items = [...productCategoryData];
                                  for (let i = 0; i < items.length; i++) {
                                    items[i].active = false;
                                  }
                                  items[index].active = true;

                                  setProductCategoryData([...items]);
                                  getProductByCategory(e.productCategoryID);
                                }}
                                label={
                                  userData.storeID === 0
                                    ? e.productCategoryName +
                                      "(" +
                                      e.storeName +
                                      ")"
                                    : e.productCategoryName
                                }
                              />
                            </Tooltip>
                          );
                        })}
                      </Tabs>
                    </Box>
                    {/* <Box
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        backgroundColor: "lavender",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item sm={6} md={1.5}>
                          <Chip
                            color="primary"
                            onClick={() => getProduct()}
                            label={"All Products"}
                          />
                        </Grid>
                        {productCategoryData.map((e, index) => {
                          return (
                            <Grid item sm={6} md={4}>
                              <Tooltip
                                title={
                                  userData.storeID === 0
                                    ? e.productCategoryName +
                                      "(" +
                                      e.storeName +
                                      ")"
                                    : e.productCategoryName
                                }
                              >
                                <Chip
                                  color={e.active ? "primary" : "secondary"}
                                  sx={{ whiteSpace: "nowrap" }}
                                  onClick={() => {
                                    let items = [...productCategoryData];
                                    for (let i = 0; i < items.length; i++) {
                                      items[i].active = false;
                                    }
                                    items[index].active = true;

                                    setProductCategoryData([...items]);
                                    getProductByCategory(e.productCategoryID);
                                  }}
                                  label={
                                    userData.storeID === 0
                                      ? e.productCategoryName +
                                        "(" +
                                        e.storeName +
                                        ")"
                                      : e.productCategoryName
                                  }
                                />
                              </Tooltip>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box> */}
                  </Grid>
                  {/* <Grid item sm={12} md={12}>
                    <Box sx={{ p: 3 }}>
                    <TextField
                      label="Search"
                      onChange={(e) => {
                        getProduct(e.target.value);
                      }} 
                      sx ={{width: '100%'}}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  </Grid> */}
                  <Grid
                    item
                    sm={12}
                    md={12}
                    style={{ maxHeight: "75vh", overflowY: "scroll" }}
                  >
                    <Grid container spacing={2}>
                      {productCard.map((e) => {
                        return (
                          <Grid item sm={12} md={3} lg={3}>
                            <Card
                              onClick={() => {
                                matchProductCard(e);
                              }}
                              className="cardPorducts"
                              sx={{
                                border: 1,

                                cursor: "pointer",
                                ...(salesData.some(
                                  (o) => o.productID === e.productID
                                ) && {
                                  borderColor: "cornflowerblue !important",
                                }),
                              }}
                            >
                              <CardContent>
                                {userData.storeID === 0 ? (
                                  <Typography
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{ whiteSpace: "nowrap", fontSize: 14 }}
                                  >
                                    {e.storeName}
                                  </Typography>
                                ) : (
                                  <Typography
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{ whiteSpace: "nowrap", fontSize: 14 }}
                                  >
                                    {e.productCategoryName}
                                  </Typography>
                                )}

                                <Typography
                                  variant="h6"
                                  sx={{ whiteSpace: "nowrap" }}
                                  component="div"
                                >
                                  {e.productName}
                                </Typography>
                                <Typography
                                  sx={{ mb: 1.5 }}
                                  color="text.secondary"
                                >
                                  Cost: {e.productCost}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={4}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Select Customer</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={4}>
                        <TextField
                          autoComplete="off"
                          id="standard-basic"
                          label="Mobile Number"
                          name="mobileNO"
                          variant="standard"
                          onChange={(e) => {
                            setCustomerDetails({
                              ...customerDetails,
                              mobileNo: e.target.value.trim(),
                            });
                          }}
                          onBlur={() => {
                            if (customerDetails.mobileNo !== "") {
                              checkCust();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              checkCust();
                            }
                          }}
                          value={customerDetails.mobileNo}
                        />
                      </Grid>
                      <Grid item sm={12} md={4}>
                        <TextField
                          autoComplete="off"
                          id="standard-basic"
                          label="Customer Name"
                          name="name"
                          variant="standard"
                          onChange={(e) => {
                            setCustomerDetails({
                              ...customerDetails,
                              name: e.target.value,
                            });
                          }}
                          value={customerDetails.name}
                          disabled={isDis}
                        />
                      </Grid>
                      <Grid item sm={12} md={4}>
                        <TextField
                          autoComplete="off"
                          id="standard-basic"
                          label="City"
                          name="city"
                          onChange={(e) => {
                            setCustomerDetails({
                              ...customerDetails,
                              city: e.target.value,
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              createCustomer();
                            }
                          }}
                          onBlur={createCustomer}
                          value={customerDetails.city}
                          variant="standard"
                          disabled={isDis}
                        />
                      </Grid>
                    </Grid>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item sm={12} xs={12} sx={{ overflow: "hidden" }}>
              <Card sx={{ minHeight: 535, height: "100%" }}>
                <CardContent>
                  {" "}
                  <Paper
                    sx={{ width: "100%", overflow: "hidden", height: "50vh" }}
                  >
                    <TableContainer
                      sx={{
                        maxHeight: "100%",
                        ...(!matches && { maxWidth: 300 }),
                      }}
                      component={Paper}
                    >
                      <Table stickyHeader aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            {/* <TableCell></TableCell> */}
                            <TableCell
                              align="center"
                              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                            >
                              {" "}
                              Product
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                            >
                              Quantity
                            </TableCell>
                            {/* <TableCell align="center">Price</TableCell> */}
                            <TableCell
                              align="center"
                              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salesData.length ? (
                            salesData.map((row, i) => (
                              <TableRow
                                key={row.productID}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                {/* <TableCell>
                                <Checkbox
                                  style={{
                                    transform: "scale(0.75)",
                                  }}
                                  color="primary"
                                  checked={row.isDiscount}
                                  onChange={() => {
                                    let item = [...salesData];
                                    item[i].isDiscount = !item[i].isDiscount;
                                    setSalesData([...item]);
                                  }}
                                  inputProps={{
                                    "aria-label": "select all desserts",
                                  }}
                                />
                              </TableCell> */}
                                <TableCell component="th" scope="row">
                                  <div className="productName">
                                    {row.productName}
                                  </div>
                                  <div className="productCost">
                                    Rs {row.productCost}
                                  </div>
                                </TableCell>
                                <TableCell align="center">
                                  <FormGroup
                                    sx={{
                                      whiteSpace: "nowrap",
                                      display: "flex",
                                      flexDirection: "row",
                                      alignContent: "center",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Button
                                      disabled={row.productQty <= 1}
                                      variant="text"
                                      sx={{ minWidth: "10px" }}
                                      onClick={() => {
                                        let item = [...salesData];
                                        item[i].productQty =
                                          Number(item[i].productQty) - 1;
                                        setSalesData([...item]);
                                      }}
                                    >
                                      <RemoveIcon sx={{ width: "14px" }} />
                                    </Button>
                                    <p>{row.productQty}</p>
                                    {/* <TextField
                                    variant="outlined"
                                    style={{ width: 50, height: "1px" }}
                                    name={`productQty${i}`}
                                    onBlur={() => {
                                      let item = [...salesData];
                                      row.productQty === 0
                                        ? (item[i].productQty = Number(1))
                                        : (item[i].productQty = Number(
                                            row.productQty
                                          ));
                                      setSalesData([...item]);
                                    }}
                                    value={row.productQty}
                                    onChange={(e) => {
                                      let item = [...salesData];
                                      item[i].productQty = Number(
                                        e.target.value
                                      );
                                      setSalesData([...item]);
                                    }}
                                    // autoFocus={
                                    //   `productQty${i}` ===
                                    //   editableKeyToFocus.current
                                    // }
                                  /> */}
                                    <Button
                                      variant="text"
                                      sx={{ minWidth: "10px" }}
                                      onClick={() => {
                                        let item = [...salesData];
                                        item[i].productQty =
                                          Number(item[i].productQty) + 1;
                                        setSalesData([...item]);
                                      }}
                                    >
                                      <AddIcon sx={{ width: "14px" }} />
                                    </Button>
                                  </FormGroup>
                                </TableCell>
                                {/* <TableCell align="center">
                                {row.productCost}
                              </TableCell> */}
                                <TableCell align="center">
                                  {Number(row.productCost) *
                                    Number(row.productQty)}
                                </TableCell>
                                <TableCell align="center">
                                  <DeleteIcon
                                    sx={{ width: "14px" }}
                                    onClick={() => {
                                      let item = [...salesData];
                                      item.splice(i, 1);
                                      setSalesData([...item]);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow hover role="checkbox" key={1}>
                              <TableCell colSpan={6} align="center" key={2}>
                                {"No Data Found"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </CardContent>{" "}
                <CardActions>
                  <Box sx={{ backgroundColor: "aliceblue", p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={6}>
                        <FormControl sx={{ m: 1 }}>
                          <InputLabel
                            htmlFor="outlined-adornment-amount"
                            sx={{ fontSize: "14px", top: "-5px" }}
                          >
                            Discount
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            endAdornment={
                              <InputAdornment position="end">%</InputAdornment>
                            }
                            label="Discount"
                            sx={{ height: "40px" }}
                            value={details.discount}
                            onChange={(e) => {
                              setDetails({
                                ...details,
                                discount: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <FormControl sx={{ m: 1 }}>
                          <InputLabel
                            htmlFor="outlined-adornment-amount"
                            sx={{ fontSize: "14px", top: "-5px" }}
                          >
                            Packing Cost
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            endAdornment={
                              <InputAdornment position="end">Rs</InputAdornment>
                            }
                            value={details.packingCharge}
                            label="Packing Cost"
                            sx={{ height: "40px" }}
                            onChange={(e) => {
                              setDetails({
                                ...details,
                                packingCharge: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item sm={12} md={12}>
                        <Box sx={{m:2}}>
                          
                        <Grid container spacing={2}>
                            <Grid sm={6} md={6}>
                              <Typography>
                                <div className="subTtlPrc">Sub Total</div>
                                <div className="quantityInfo">(Quantity: {" "}
                            {salesData.reduce(
                              (a, b) => Number(b.productQty) + a,
                              0
                            )})</div>
                              </Typography>
                            </Grid>

                            <Grid sm={6} md={6}>
                              <Typography sx={{textAlign:"right",fontSize:"14px"}}>{" "}
                            {salesData.reduce(
                              (a, b) =>
                                Number(b.productCost) * Number(b.productQty) +
                                a,
                              0
                            )}
                              </Typography>
                            </Grid>
                        </Grid>
                          </Box>
                          <Box sx={{m:2}}>
                            <Grid container spacing={2}>
                            <Grid sm={6} md={6}>
                              <Typography>
                                <div className="ttlPrc">Total</div>
                              </Typography>
                            </Grid>
                            <Grid sm={6} md={6}>
                              <Typography sx={{textAlign:"right",fontWeight:"bold",fontSize:"24px"}}>{" "}
                            {salesData.reduce(
                              (a, b) =>
                                Number(b.productCost) * Number(b.productQty) +
                                a,
                              0
                            ) -
                              salesData
                                .filter((e) => e.isDiscount)
                                .reduce(
                                  (a, b) =>
                                    Number(b.productCost) *
                                      Number(b.productQty) +
                                    a,
                                  0
                                ) *
                                (Number(details.discount) / 100) +
                              Number(details.packingCharge)}{" "}
                              </Typography>
                          </Grid></Grid>
                          {/* <Typography>
                            Total Qty:{" "}
                            {salesData.reduce(
                              (a, b) => Number(b.productQty) + a,
                              0
                            )}
                          </Typography>
                          <Typography>
                            Sub Total:{" "}
                            {salesData.reduce(
                              (a, b) =>
                                Number(b.productCost) * Number(b.productQty) +
                                a,
                              0
                            )}
                          </Typography>
                          <Typography>
                            Total:{" "}
                            {salesData.reduce(
                              (a, b) =>
                                Number(b.productCost) * Number(b.productQty) +
                                a,
                              0
                            ) -
                              salesData
                                .filter((e) => e.isDiscount)
                                .reduce(
                                  (a, b) =>
                                    Number(b.productCost) *
                                      Number(b.productQty) +
                                    a,
                                  0
                                ) *
                                (Number(details.discount) / 100) +
                              Number(details.packingCharge)}{" "}
                          </Typography> */}
                        </Box>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <ButtonGroup
                        variant="outlined"
                        aria-label="outlined button group"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Button onClick={print} sx={{width:"48%",background: "#1976d2",color:"#fff"}} className="printBtn">Print</Button>
                        <Button onClick={saveSales} sx={{width:"48%",background: "#1976d2",color:"#fff"}} className="saveBtn">Save</Button>
                      </ButtonGroup>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Pos;
