import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import APIKit from "../../utilities/APIKIT";
import { MESSAGE } from "../../utilities/constant";
import { URLS } from "../../utilities/URLS";
import { dateForm, state } from "../common/utilities";
function Invoice() {
  const invoiceDataRedux = useSelector((x) => x.NavigationData.navigationData);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const saveInvoice = async () => {
    if (isEdit) {
      const pay = {
        invoiceMasterID: invoiceDataRedux.invoiceMasterID,
        invoiceNumber: payload.invoiceNo,
        invoiceDate: String(dateForm(payload.invoiceDate)),
        state: payload.state ?? "Tamil Nadu",
        customerName: customerDetails.name,
        customerMobile: customerDetails.mobileNo,
        customerAddress: customerDetails.address,
        gst: payload.gst,
        email: payload.email,
        totalNoofProducts: Number(salesData.length),
        subTotal: String(
          salesData.reduce(
            (a, b) => Number(b.productCost) * Number(b.productQty) + a,
            0
          )
        ),
        SGST: Number(details.SGST),
        CGST: Number(details.CGST),
        IGST: Number(details.IGST),
        total: String(
          salesData.reduce(
            (a, b) => Number(b.productCost) * Number(b.productQty) + a,
            0
          ) +
            salesData
              .filter((e) => e.isDiscount)
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.SGST) / 100) +
            salesData
              .filter((e) => e.isDiscount)
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.CGST) / 100) +
            salesData
              .filter((e) => e.isDiscount)
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.IGST) / 100)
        ),
        products: salesData
          .filter((a) => a.productID !== "")
          .map((e) => {
            return {
              productName: e.productName,
              productCost: String(e.productCost),
              productQty: Number(e.productQty),
            };
          }),
      };
      if (!pay.products.length) {
        variant = "error";
        enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
        return;
      }
      await APIKit.put(URLS.updateInvoice, pay).then((res) => {
        if (res.data.status === 200) {
          setSalesData([{ ...initialValues }]);
          setDetails({
            SGST: "",
            CGST: "",
            IGST: "",
          });
          setCustomerDetails({
            name: "",
            mobileNo: "",
            address: "",
          });
          setPayload({
            invoiceNo: "",
            gst: "",
            email: "",
          });
          variant = "success";
          enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        } else {
          variant = "error";
          enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        }
      });
    } else {
      const pay = {
        invoiceNumber: payload.invoiceNo,
        invoiceDate: String(dateForm(payload.invoiceDate)),
        state: payload.state ?? "Tamil Nadu",
        customerName: customerDetails.name,
        customerMobile: customerDetails.mobileNo,
        customerAddress: customerDetails.address,
        gst: payload.gst,
        email: payload.email,
        totalNoofProducts: Number(salesData.length),
        subTotal: String(
          salesData.reduce(
            (a, b) => Number(b.productCost) * Number(b.productQty) + a,
            0
          )
        ),
        SGST: Number(details.SGST),
        CGST: Number(details.CGST),
        IGST: Number(details.IGST),
        total: String(
          salesData.reduce(
            (a, b) => Number(b.productCost) * Number(b.productQty) + a,
            0
          ) +
            salesData
              .filter((e) => e.isDiscount)
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.SGST) / 100) +
            salesData
              .filter((e) => e.isDiscount)
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.CGST) / 100) +
            salesData
              .filter((e) => e.isDiscount)
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.IGST) / 100)
        ),
        products: salesData
          .filter((a) => a.productID !== "")
          .map((e) => {
            return {
              productName: e.productName,
              productCost: String(e.productCost),
              productQty: Number(e.productQty),
            };
          }),
      };
      if (!pay.products.length) {
        variant = "error";
        enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
        return;
      }
      await APIKit.post(URLS.addInvoice, pay).then((res) => {
        if (res.data.status === 200) {
          setSalesData([{ ...initialValues }]);
          setDetails({
            SGST: "",
            CGST: "",
            IGST: "",
          });
          setCustomerDetails({
            name: "",
            mobileNo: "",
            address: "",
          });
          setPayload({
            invoiceNo: "",
            gst: "",
            email: "",
          });
          variant = "success";
          enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        } else {
          variant = "error";
          enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        }
      });
    }
  };
  const initialValues = {
    productCode: "",
    productName: "",
    productQty: "",
    productCost: "",
    productID: "",
    isDiscount: true,
  };
  const [salesData, setSalesData] = useState([{ ...initialValues }]);


  useEffect(() => {
    getProduct();
    // eslint-disable-next-line
  }, []);
  const [product, setProduct] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const getProduct = async (data = "") => {
    setIsLoading(true);
    await APIKit.post(URLS.getProduct, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.data);
        setIsLoading(false);
        console.log(invoiceDataRedux);
        if (Object.keys(invoiceDataRedux).length) {
          setIsEdit(true);
          setDetails({
            SGST: invoiceDataRedux.SGST,
            CGST: invoiceDataRedux.CGST,
            IGST: invoiceDataRedux.IGST,
          });
          setCustomerDetails({
            name: invoiceDataRedux.customerName,
            mobileNo: invoiceDataRedux.customerMobile,
            address: invoiceDataRedux.customerAddress,
          });
          setPayload({
            invoiceNo: invoiceDataRedux.invoiceNumber,
            invoiceDate: invoiceDataRedux.invoiceDate,
            gst: invoiceDataRedux.gst,
            email: invoiceDataRedux.email,
            state: invoiceDataRedux.state,
          });
          console.log(res.data.data);
          setSalesData(
            invoiceDataRedux.invoiceProducts.map((e) => {
              return {
                productCode: res.data.data.find(
                  (elem) => elem.productName === e.productName
                )?.productCode,
                productCost: e.productCost,
                productName: e.productName,
                productQty: e.productQty,
                isDiscount: true,
              };
            })
          );
        }
      } else {
        setIsLoading(false);
      }
    });
  };
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  let editableKeyToFocus = useRef(null);

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobileNo: "",
    address: "",
  });
  function matchProduct(index) {
    let item = [...salesData];
    var valueArr = salesData.map(function (item) {
      return item.productCode;
    });
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    if (isDuplicate) {
      editableKeyToFocus.current = `productQty${valueArr.indexOf(
        salesData[index].productCode
      )}`;
      salesData[index] = initialValues;
      setSalesData([...salesData]);
      variant = "error";
      enqueueSnackbar("This Product Already Added", { variant, anchorOrigin });
      return;
    }
    for (var i = 0; i < product.length; i++) {
      if (product[i].productCode === item[index].productCode) {
        item[index].productName = product[i].productName;
        item[index].productCost = product[i].productCost;
        item[index].productID = product[i].productID;
        item[index].isDis = true;
        setSalesData([...item]);
        editableKeyToFocus.current = `productQty${index}`;
        break;
      } else {
        item[index].productName = "";
        item[index].productCost = "";
        item[index].productID = "";
        item[index].isDis = false;
        setSalesData([...item]);
      }
    }
    if (item[index].productCode === "") {
      editableKeyToFocus.current = `productCode${index}`;
      setSalesData([...salesData]);
      variant = "error";
      enqueueSnackbar("Enter Product Code", { variant, anchorOrigin });
      return;
    }
    if (item[index].productName === "") {
      variant = "error";
      enqueueSnackbar("Invalid Product Code", { variant, anchorOrigin });
      return;
    }
  }
  const [details, setDetails] = useState({
    SGST: "",
    CGST: "",
    IGST: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  let regEx = {
    numbersOnly: /^[0-9]*$/,
  };
  const addRemProduct = async (data, i) => {
    if (data === "add") {
      if (salesData[i].productQty === 0 || salesData[i].productQty === "") {
        editableKeyToFocus.current = `productQty${i}`;
        setSalesData([...salesData]);
        variant = "error";
        enqueueSnackbar("Please give atleast 1 Qty", { variant, anchorOrigin });
        return;
      }
      if (salesData[i].productCost === 0 || salesData[i].productCost === "") {
        editableKeyToFocus.current = `productCost${i}`;
        setSalesData([...salesData]);
        variant = "error";
        enqueueSnackbar("Give Valid Amount", { variant, anchorOrigin });
        return;
      }
      if (salesData.length === i + 1) {
        let item = [...salesData];
        item.push(initialValues);
        setSalesData([...item]);
        editableKeyToFocus.current = `productCode${i + 1}`;
      } else {
        setSalesData([...salesData]);
        editableKeyToFocus.current = `productCode${i + 1}`;
      }
    } else {
      if (salesData.length > 1) {
        let item = [...salesData];
        item.splice(i, 1);
        setSalesData([...item]);
      }
    }
  };
  const print = async () => {
    const oldPage = document.body.innerHTML;
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
              <div style="font-size:14px;">${customerDetails.address} </div>
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
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Subtotal : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">${salesData.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  )}</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Discount : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">${
                    details.discount
                  }%</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
              <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Packing Charges (3%) : </td>
              <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">Rs.${
                details.packingCharge
              }</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Total : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">Rs.${
                    salesData.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) -
                    salesData.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
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
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) -
                    salesData.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
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
    document.body.innerHTML = html;
    window.print();
    document.body.innerHTML = oldPage;
    window.location.reload();
  };
  const [payload, setPayload] = useState({
    invoiceNo: "",
    invoiceDate: null,
    gst: "",
    email: "",
    state: "Tamil Nadu",
  });
  return (
    <>
      <Grid spacing={3}>
        <Grid item sm={12} md={12}>
          <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2, mb: 4 }}>
            <Box
              sx={{
                p: 4,
              }}
            >
              <Grid container spacing={4}>
                <Grid item md={4} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Invoice Number"
                    name="invoiceNo"
                    autoFocus
                    onChange={(e) => {
                      if (
                        e.target.value === "" ||
                        regEx.numbersOnly.test(e.target.value)
                      ) {
                        editableKeyToFocus.current = `invoiceNo`;
                        setPayload({
                          ...payload,
                          invoiceNo: e.target.value.trim(),
                        });
                      }
                    }}
                    value={payload.invoiceNo}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Invoice Date"
                      openTo="year"
                      views={["year", "month", "day"]}
                      value={payload.invoiceDate}
                      format="YYYY-MM-DD"
                      onChange={(newValue) => {
                        setPayload({
                          ...payload,
                          invoiceDate: newValue.$d,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={4} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">State</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={payload.state}
                      label="State"
                      onChange={(e) => {
                        setPayload({
                          ...payload,
                          state: e.target.value,
                        });
                      }}
                    >
                      {state.map((data, i) => {
                        return <MenuItem value={data}>{data}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Customer Mobile Number"
                    name="mobileNo"
                    onChange={(e) => {
                      if (
                        e.target.value === "" ||
                        regEx.numbersOnly.test(e.target.value)
                      ) {
                        editableKeyToFocus.current = `mobileNo`;
                        setCustomerDetails({
                          ...customerDetails,
                          mobileNo: e.target.value.trim(),
                        });
                      }
                    }}
                    value={customerDetails.mobileNo}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Customer Name"
                    name="name"
                    onChange={(e) => {
                      setCustomerDetails({
                        ...customerDetails,
                        name: e.target.value,
                      });
                    }}
                    fullWidth
                    value={customerDetails.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Address"
                    name="address"
                    onChange={(e) => {
                      setCustomerDetails({
                        ...customerDetails,
                        address: e.target.value,
                      });
                    }}
                    fullWidth
                    value={customerDetails.address}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="GST"
                    name="gst"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        gst: e.target.value,
                      });
                    }}
                    fullWidth
                    value={payload.gst}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    name="email"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        email: e.target.value,
                      });
                    }}
                    fullWidth
                    value={payload.email}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={12} sm={12} sx={{ overflow: "auto" }}>
                  <TableContainer component={Paper} sx={{ mt: 3 }} id="printme">
                    <Table sx={{ minWidth: 300 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell padding="checkbox"></StyledTableCell>
                          <StyledTableCell align="center">SNo</StyledTableCell>
                          <StyledTableCell align="center">
                            Product Code
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Product Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Quantity
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Rate Per Unit
                          </StyledTableCell>
                          <StyledTableCell align="center">Rate</StyledTableCell>
                          <StyledTableCell align="center">
                            Action
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesData.map((data, i) => {
                          return (
                            <StyledTableRow
                              key={i}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                addRemProduct("rem", i);
                              }}
                            >
                              <StyledTableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={data.isDiscount}
                                  onChange={() => {
                                    let item = [...salesData];
                                    item[i].isDiscount = !item[i].isDiscount;
                                    setSalesData([...item]);
                                  }}
                                  inputProps={{
                                    "aria-label": "select all desserts",
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {i + 1}
                              </StyledTableCell>

                              <StyledTableCell align="center">
                                <TextField
                                  id="outlined-basic"
                                  label="Product Code"
                                  name={`productCode${i}`}
                                  variant="outlined"
                                  onBlur={() => {
                                    if (data.productCode !== "") {
                                      matchProduct(i);
                                    }
                                  }}
                                  onChange={(e) => {
                                    editableKeyToFocus.current = `productCode${i}`;
                                    let item = [...salesData];
                                    item[i].productCode = e.target.value;
                                    setSalesData([...item]);
                                  }}
                                  autoFocus={
                                    `productCode${i}` ===
                                    editableKeyToFocus.current
                                  }
                                  value={data.productCode}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      console.log("match", e.key);
                                      matchProduct(i);
                                    }
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {data.productName}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <FormGroup
                                  sx={{
                                    whiteSpace: "nowrap",
                                    display: "unset",
                                  }}
                                >
                                  <Button
                                    disabled={data.productQty <= 1}
                                    variant="text"
                                    sx={{ mt: 1 }}
                                    onClick={() => {
                                      editableKeyToFocus.current = `productQty${i}`;
                                      let item = [...salesData];
                                      item[i].productQty =
                                        Number(item[i].productQty) - 1;
                                      setSalesData([...item]);
                                    }}
                                  >
                                    <RemoveIcon />
                                  </Button>
                                  <TextField
                                    variant="outlined"
                                    style={{ width: 70 }}
                                    name={`productQty${i}`}
                                    value={data.productQty}
                                    onBlur={() => {
                                      if (
                                        data.productQty === 0 ||
                                        data.productQty === ""
                                      ) {
                                        let item = [...salesData];
                                        data.productQty === 0 ||
                                        data.productQty === ""
                                          ? (item[i].productQty = Number(1))
                                          : (item[i].productQty = Number(
                                              data.productQty
                                            ));
                                        setSalesData([...item]);
                                      }
                                    }}
                                    onChange={(e) => {
                                      if (
                                        e.target.value === "" ||
                                        regEx.numbersOnly.test(e.target.value)
                                      ) {
                                        editableKeyToFocus.current = `productQty${i}`;
                                        let item = [...salesData];
                                        item[i].productQty = Number(
                                          e.target.value
                                        );
                                        setSalesData([...item]);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        console.log("add", e);
                                        addRemProduct("add", i);
                                      }
                                    }}
                                    autoFocus={
                                      `productQty${i}` ===
                                      editableKeyToFocus.current
                                    }
                                  />
                                  <Button
                                    variant="text"
                                    onClick={() => {
                                      editableKeyToFocus.current = `productQty${i}`;
                                      let item = [...salesData];
                                      item[i].productQty =
                                        Number(item[i].productQty) + 1;
                                      setSalesData([...item]);
                                    }}
                                  >
                                    <AddIcon />
                                  </Button>
                                </FormGroup>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <TextField
                                  variant="outlined"
                                  style={{ width: 70 }}
                                  name={`productCost${i}`}
                                  value={data.productCost}
                                  onBlur={() => {
                                    if (
                                      data.productCost === 0 ||
                                      data.productCost === ""
                                    ) {
                                      let item = [...salesData];
                                      data.productCost === 0 ||
                                      data.productCost === ""
                                        ? (item[i].productCost = Number(1))
                                        : (item[i].productCost = Number(
                                            data.productCost
                                          ));
                                      setSalesData([...item]);
                                    }
                                  }}
                                  onChange={(e) => {
                                    if (
                                      e.target.value === "" ||
                                      regEx.numbersOnly.test(e.target.value)
                                    ) {
                                      editableKeyToFocus.current = `productCost${i}`;
                                      let item = [...salesData];
                                      item[i].productCost = Number(
                                        e.target.value
                                      );
                                      setSalesData([...item]);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      console.log("add", e);
                                      addRemProduct("add", i);
                                    }
                                  }}
                                  autoFocus={
                                    `productCost${i}` ===
                                    editableKeyToFocus.current
                                  }
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {data.productQty !== ""
                                  ? data.productQty * data.productCost
                                  : data.productCost}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {salesData.length !== 1 && (
                                  <DeleteIcon
                                    onClick={() => {
                                      addRemProduct("rem", i);
                                    }}
                                  />
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid
                  item
                  md={4}
                  sm={12}
                  sx={{ overflow: "auto", marginLeft: "auto" }}
                >
                  <TableContainer component={Paper} sx={{ mt: 2 }} id="printme">
                    <Table aria-label="customized table">
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            Subtotal
                          </TableCell>
                          <TableCell align="center">
                            {salesData.reduce(
                              (a, b) =>
                                Number(b.productCost) * Number(b.productQty) +
                                a,
                              0
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            SGST
                          </TableCell>
                          <TableCell align="center">
                            <FormControl variant="standard">
                              <InputLabel htmlFor="standard-adornment-amount">
                                Percentage
                              </InputLabel>
                              <Input
                                id="standard-adornment-amount"
                                startAdornment={
                                  <InputAdornment position="start">
                                    %
                                  </InputAdornment>
                                }
                                name={`SGST`}
                                autoFocus={
                                  `SGST` === editableKeyToFocus.current
                                }
                                onChange={(e) => {
                                  editableKeyToFocus.current = `SGST`;
                                  setDetails({
                                    ...details,
                                    SGST: e.target.value,
                                  });
                                }}
                                value={details.SGST}
                              />
                            </FormControl>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            CGST
                          </TableCell>
                          <TableCell align="center">
                            <FormControl variant="standard">
                              <InputLabel htmlFor="standard-adornment-amount">
                                Percentage
                              </InputLabel>
                              <Input
                                id="standard-adornment-amount"
                                startAdornment={
                                  <InputAdornment position="start">
                                    %
                                  </InputAdornment>
                                }
                                name={`CGST`}
                                autoFocus={
                                  `CGST` === editableKeyToFocus.current
                                }
                                onChange={(e) => {
                                  editableKeyToFocus.current = `CGST`;
                                  setDetails({
                                    ...details,
                                    CGST: e.target.value,
                                  });
                                }}
                                value={details.CGST}
                              />
                            </FormControl>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            IGST
                          </TableCell>
                          <TableCell align="center">
                            <FormControl variant="standard">
                              <InputLabel htmlFor="standard-adornment-amount">
                                Percentage
                              </InputLabel>
                              <Input
                                id="standard-adornment-amount"
                                startAdornment={
                                  <InputAdornment position="start">
                                    %
                                  </InputAdornment>
                                }
                                name={`IGST`}
                                autoFocus={
                                  `IGST` === editableKeyToFocus.current
                                }
                                onChange={(e) => {
                                  editableKeyToFocus.current = `discount`;
                                  setDetails({
                                    ...details,
                                    IGST: e.target.value,
                                  });
                                }}
                                value={details.IGST}
                              />
                            </FormControl>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            Total
                          </TableCell>
                          <TableCell align="center">
                            {(
                              salesData.reduce(
                                (a, b) =>
                                  Number(b.productCost) * Number(b.productQty) +
                                  a,
                                0
                              ) +
                              salesData
                                .filter((e) => e.isDiscount)
                                .reduce(
                                  (a, b) =>
                                    Number(b.productCost) *
                                      Number(b.productQty) +
                                    a,
                                  0
                                ) *
                                (Number(details.SGST) / 100) +
                              salesData
                                .filter((e) => e.isDiscount)
                                .reduce(
                                  (a, b) =>
                                    Number(b.productCost) *
                                      Number(b.productQty) +
                                    a,
                                  0
                                ) *
                                (Number(details.CGST) / 100) +
                              salesData
                                .filter((e) => e.isDiscount)
                                .reduce(
                                  (a, b) =>
                                    Number(b.productCost) *
                                      Number(b.productQty) +
                                    a,
                                  0
                                ) *
                                (Number(details.IGST) / 100)
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "& > *": {
                        m: 2,
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                    >
                      {isEdit ? (
                        <Button onClick={saveInvoice}>Update</Button>
                      ) : (
                        <Button onClick={saveInvoice}>Save</Button>
                      )}

                      <Button onClick={print}>Print</Button>
                    </ButtonGroup>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Invoice;
