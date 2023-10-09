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
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import APIKit from "../../utilities/APIKIT";
import { MESSAGE } from "../../utilities/constant";
import { URLS } from "../../utilities/URLS";

function SalesNew() {
  const salesDataRedux = useSelector((x) => x.NavigationData.navigationData);
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
  const saveSales = async () => {
    if (isEdit) {
      const pay = {
        salesMasterID: salesDataRedux.salesMasterID,
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
      if (pay.customerID === "") {
        variant = "error";
        enqueueSnackbar(MESSAGE.custDetails, { variant, anchorOrigin });
        return;
      }
      if (!pay.products.length) {
        variant = "error";
        enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
        return;
      }
      await APIKit.put(URLS.updateSales, pay).then((res) => {
        if (res.data.status === 200) {
          setSalesData([{ ...initialValues }]);
          setDetails({
            discount: "",
            packingCharge: "",
          });
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
    } else {
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
      if (pay.customerID === "") {
        variant = "error";
        enqueueSnackbar(MESSAGE.custDetails, { variant, anchorOrigin });
        return;
      }
      if (!pay.products.length) {
        variant = "error";
        enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
        return;
      }
      await APIKit.post(URLS.addSales, pay).then((res) => {
        if (res.data.status === 200) {
          setSalesData([{ ...initialValues }]);
          setDetails({
            discount: "",
            packingCharge: "",
          });
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
    getCustomer();
    getProduct();
  }, []);
  const [product, setProduct] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const getProduct = async (data = "") => {
    setIsLoading(true);
    await APIKit.post(URLS.getProduct, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.data);
        setIsLoading(false);
        if (Object.keys(salesDataRedux).length) {
          setIsEdit(true)
          setDetails({
            discount: salesDataRedux.discount,
            packingCharge: salesDataRedux.packingCost,
          })
          setCustomerDetails({
            customerID: salesDataRedux.customerID,
            name: salesDataRedux.customerName,
            mobileNo: salesDataRedux.customerMobile,
            city: salesDataRedux.customerCity,
          });
          setSalesData(
            salesDataRedux.salesProducts.map((e) => {
              return {
                productCode: res.data.data.find(
                  (elem) => elem.productName === e.productName
                ).productCode,
                productCost: e.productCost,
                productName: e.productName,
                productQty: e.productQty,
                isDiscount: true
              };
            })
          );
        }
      } else {
        setIsLoading(false);
      }
    });
  };
  const [isDis, setIsDis] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  let editableKeyToFocus = useRef(null);

  const [customerDetails, setCustomerDetails] = useState({
    customerID: "",
    name: "",
    mobileNo: "",
    city: "",
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
    discount: "",
    packingCharge: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const checkCust = async (e) => {
    if (
      customerDetails.mobileNo.length < 10 ||
      customerDetails.mobileNo.length > 10
    ) {
      variant = "error";
      enqueueSnackbar(MESSAGE.mobNo, { variant, anchorOrigin });
      return;
    }
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
        editableKeyToFocus.current = `productCode0`;
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
    // setCustomerDetails({...customerDetails})
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
        editableKeyToFocus.current = `productCode0`;
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

  const getCustomer = async (data = "") => {
    setIsLoading(true);
    await APIKit.get(URLS.getCustomer).then((res) => {
      if (res.data.status === 200) {
        setCustomerList([...res.data.data]);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

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
        editableKeyToFocus.current = `productCode${salesData.length - 1}`;
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
    if (pay.customerID === "") {
      variant = "error";
      enqueueSnackbar(MESSAGE.custDetails, { variant, anchorOrigin });
      return;
    }
    if (!pay.products.length) {
      variant = "error";
      enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
      return;
    }
    await saveSales()
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
   
    var printWindow = window.open('', '', 'height=500,width=1000');
printWindow.document.write(html);
printWindow.document.close();
printWindow.print();
  };

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
                    label="Enter Customer Mobile Number"
                    name="mobileNo"
                    autoFocus
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        checkCust();
                      }
                    }}
                    onBlur={() => {
                      if (customerDetails.mobileNo !== "") {
                        checkCust();
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
                    label="Enter Customer Name"
                    disabled={isDis}
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
                    label="Customer City"
                    name="city"
                    disabled={isDis}
                    onChange={(e) => {
                      setCustomerDetails({
                        ...customerDetails,
                        city: e.target.value,
                      });
                    }}
                    onBlur={createCustomer}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        createCustomer();
                      }
                    }}
                    fullWidth
                    value={customerDetails.city}
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
                            Discount
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
                                name={`discount`}
                                autoFocus={
                                  `discount` === editableKeyToFocus.current
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    console.log("hi");
                                    e.preventDefault();
                                    editableKeyToFocus.current = `packingCharge`;
                                    
                                  }
                                }}
                                onChange={(e) => {
                                  editableKeyToFocus.current = `discount`;
                                  setDetails({
                                    ...details,
                                    discount: e.target.value,
                                  });
                                }}
                                value={details.discount}
                              />
                            </FormControl>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            Packing Charge
                          </TableCell>
                          <TableCell align="center">
                            <FormControl variant="standard">
                              <InputLabel htmlFor="standard-adornment-amount">
                                Amount
                              </InputLabel>
                              <Input
                                id="standard-adornment-amount"
                                name={`packingCharge`}
                                autoFocus={
                                  `packingCharge` === editableKeyToFocus.current
                                }
                                onChange={(e) => {
                                  editableKeyToFocus.current = `packingCharge`;
                                  setDetails({
                                    ...details,
                                    packingCharge: e.target.value,
                                  });
                                }}
                                value={details.packingCharge}
                                startAdornment={
                                  <InputAdornment position="start">
                                    Rs
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right">
                            Total
                          </TableCell>
                          <TableCell align="center">
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
                              Number(details.packingCharge)}
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
                      {isEdit ? 
                      <Button onClick={saveSales}>Update</Button>
                      : 
                      <Button onClick={saveSales}>Save</Button>
                      }
                      
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

export default SalesNew;
