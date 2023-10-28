import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Grid, Stack } from "@mui/material";
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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import APIKit from "../../utilities/APIKIT";
import { MESSAGE } from "../../utilities/constant";
import { URLS } from "../../utilities/URLS";
import "./pos.css";
import soundFile from "../../../assets/audio/stop-13692.mp3";
import { deepOrange, deepPurple } from "@mui/material/colors";
import POSProduct from "../PosProduct";

function Pos(props) {
  const audioRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 45,
      minHeight: 55,
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
  }, [customerDetails, customerList]);
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
  const [fileteredProducts, setFileteredProducts] = useState([]);
  useEffect(() => {
    setFileteredProducts(product);
  }, [product]);
  const handleChange = (data) => {
    if (data === "All") {
      setFileteredProducts(product);
      return;
    }
    const filtered = product.filter(
      (product) => product.productCategory === data
    );
    setFileteredProducts(filtered);
  };
  return (
    <div>
      <audio ref={audioRef}>
        <source src={soundFile} type="audio/mpeg" />
      </audio>
      <Grid container spacing={3} p={1}>
        <Grid item sm={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                fullWidth
                autoComplete="off"
                id="outlined-basic"
                label="Mobile Number"
                name="mobileNO"
                variant="outlined"
                onChange={(e) => {
                  setCustomerDetails({
                    ...customerDetails,
                    mobileNo: e.target.value.trim(),
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                fullWidth
                autoComplete="off"
                id="outlined-basic"
                label="Customer Name"
                name="name"
                variant="outlined"
                onChange={(e) => {
                  setCustomerDetails({
                    ...customerDetails,
                    name: e.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                fullWidth
                autoComplete="off"
                id="outlined-basic"
                label="City"
                name="city"
                variant="outlined"
                onChange={(e) => {
                  setCustomerDetails({
                    ...customerDetails,
                    city: e.target.value.trim(),
                  });
                }}
              />
            </Grid>
            <Grid item sm={12} xs={12} md={12} sx={{ overflow: "hidden" }}>
              <div
                style={{
                  maxHeight: "450px",
                  overflowY: "auto",
                  maxWidth: "100%",
                  overflowX: "hidden",
                }}
              >
                <TableContainer
                  component={Paper}
                  sx={{
                    height: 450,
                    maxWidth: { md: "100%", xs: 355 },
                    overflowX: "scroll",
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">S.No</TableCell>
                        <TableCell align="center"> Product</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Sub Total</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesData.length ? (
                        salesData.map((row, i) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              backgroundColor: "#F5F5F5",
                              "&:hover": { backgroundColor: "#E0E0E0" },
                            }}
                          >
                            <TableCell align="center">{i + 1}</TableCell>
                            <TableCell align="center">
                              {row.productName.length > 15 ? (
                                <Tooltip title={row.productName}>
                                  {`${row.productName.substring(0, 15)}...`}
                                </Tooltip>
                              ) : (
                                row.productName
                              )}
                            </TableCell>

                            <TableCell align="center">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: "red",
                                    width: "20px",
                                    borderRadius: "15px",
                                    color: "#fff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    let item = [...salesData];
                                    item[i].productQty =
                                      Number(item[i].productQty) - 1;
                                    setSalesData([...item]);
                                  }}
                                >
                                  -
                                </div>
                                <input
                                  type="text"
                                  style={{
                                    width: 30,
                                    textAlign: "center",
                                  }}
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
                                    item[i].productQty = Number(e.target.value);
                                    setSalesData([...item]);
                                  }}
                                />{" "}
                                <div
                                  style={{
                                    backgroundColor: "green",
                                    width: "20px",
                                    borderRadius: "15px",
                                    color: "#fff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    let item = [...salesData];
                                    item[i].productQty =
                                      Number(item[i].productQty) + 1;
                                    setSalesData([...item]);
                                  }}
                                >
                                  +
                                </div>
                              </div>
                            </TableCell>
                            <TableCell align="center">{row.price}</TableCell>
                            <TableCell align="center">
                              {Number(row.price) * Number(row.productQty)}
                            </TableCell>
                            <TableCell align="center">
                              <DeleteIcon
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
                        <TableRow style={{ height: 380 }}>
                          <TableCell colSpan={6} align="center" key={2}>
                            {"No Data Found"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
            <Grid
              item
              sm={12}
              md={12}
              xs={12}
              sx={{ backgroundColor: "lightgray" }}
            >
              <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                  <Box>
                    <Typography>
                      Total Qty:{" "}
                      {salesData.reduce((a, b) => Number(b.productQty) + a, 0)}
                    </Typography>
                    <Typography>
                      Sub Total:{" Rs."}
                      {salesData.reduce(
                        (a, b) => Number(b.price) * Number(b.productQty) + a,
                        0
                      )}
                    </Typography>
                    <Typography>
                      Total:{" Rs."}
                      {salesData.reduce(
                        (a, b) => Number(b.price) * Number(b.productQty) + a,
                        0
                      ) -
                        salesData
                          .filter((e) => e.isDiscount)
                          .reduce(
                            (a, b) =>
                              Number(b.productCost) * Number(b.productQty) + a,
                            0
                          )}{" "}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                    >
                      {/* <Button onClick={saveOrder}>Save</Button> */}
                      <Button onClick={print}>Print</Button>
                      {/* <Button onClick={reset}>Reset</Button> */}
                    </ButtonGroup>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid container spacing={2}>
            <Grid item sm={12} xs={12} md={12}>
              <Select
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                placeholder={"Search Products"}
                onChange={(data) => {
                  if (data) {
                    matchProductCard(product.find((e) => e.id === data.value));
                  }
                }}
                formatOptionLabel={(option) => (
                  <div style={{ display: "flex" }}>
                    <img
                      src={option.imageURL}
                      alt={option.label}
                      style={{ width: "30px", marginRight: "10px" }}
                    />
                    <span style={{ marginTop: "7px" }}>{option.label}</span>
                  </div>
                )}
                options={product?.map((e) => {
                  return {
                    value: e.id,
                    label: e.productName,
                    imageURL: e.imageURL,
                  };
                })}
              />
            </Grid>
            <Grid item sm={12} xs={12} md={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 4,
                  // backgroundColor: "lavender",
                }}
              >
                <Grid container spacing={2} sx={{ overflow: "hidden" }}>
                  <div
                    style={{
                      padding: "10px",
                      maxWidth: "100%",
                      overflowX: "hidden",
                    }}
                  >
                    <Stack
                      className="scrollable-container"
                      direction="row"
                      spacing={2}
                      sx={{
                        maxWidth: { md: "100%", xs: 330 },
                        overflowX: "auto",
                      }}
                    >
                      <div style={{ flexDirection: "column" }}>
                        <Avatar
                          sx={{
                            bgcolor: productCategoryData.some(
                              (e) => e.active === true
                            )
                              ? deepPurple[500]
                              : deepOrange[500],
                            cursor: "pointer",
                          }}
                          alt={"All"}
                          src={"e.imageURL"}
                          onClick={() => {
                            let items = [...productCategoryData];
                            for (let i = 0; i < items.length; i++) {
                              items[i].active = false;
                            }

                            setProductCategoryData([...items]);
                            handleChange("All");
                          }}
                        />
                        <div
                          style={{
                            fontSize: "10px",
                            textAlign: "center",
                            marginTop: "5px",
                          }}
                        >
                          All
                        </div>
                      </div>
                      {productCategoryData.map((e, index) => {
                        return (
                          <div style={{ flexDirection: "column" }}>
                            <Avatar
                              sx={{
                                bgcolor: e.active
                                  ? deepOrange[500]
                                  : deepPurple[500],
                                cursor: "pointer",
                              }}
                              alt={e.categoryName}
                              src={e.imageURL ?? e.categoryName}
                              onClick={() => {
                                let items = [...productCategoryData];
                                for (let i = 0; i < items.length; i++) {
                                  items[i].active = false;
                                }
                                items[index].active = true;

                                setProductCategoryData([...items]);
                                handleChange(e.categoryName);
                              }}
                            />
                            <div
                              style={{
                                fontSize: "10px",
                                textAlign: "center",
                                marginTop: "5px",
                              }}
                            >
                              {e.categoryName}
                            </div>
                          </div>
                        );
                      })}
                    </Stack>
                  </div>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <div style={{ maxHeight: "530px", overflowY: "auto" }}>
                <Grid container spacing={2}>
                  {fileteredProducts.map((e) => (
                    <Grid item sm={12} xs={6} md={3} key={e.id}>
                      <div
                        onClick={() => matchProductCard(e)}
                        style={{ cursor: "pointer" }}
                      >
                        <POSProduct product={e} nowDis={0} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Pos;
