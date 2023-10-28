import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { URLS } from "../../utilities/URLS";
import APIKit from "../../utilities/APIKIT";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import { useSnackbar } from "notistack";
import Loader from "../common/CommonLoader";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
function Sales(props) {
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
  
  const printFun = () => {
    // var orderHtml = '<html><head><title></title></head><body>' + printableElements + '</body></html>'
    const oldPage = document.body.innerHTML;
    const html = `<html><head><title></title>
    <style>
    #estimate {
      margin-top: 30px;
      font-family: Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    
    #estimate td, #estimate th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    #estimate tr:nth-child(even){background-color: #f2f2f2;}
    
    #estimate tr:hover {background-color: #ddd;}
    
    #estimate th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #000000;
      color: white;
    }
    #customerDetails {
      display: flex;
      justify-content: space-around
    }
    .container {
      margin-top: 30px;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }
    @media (min-width: 768px) {
      .container {
        width: 750px;
      }
    }
    @media (min-width: 992px) {
      .container {
        width: 970px;
      }
    }
    @media (min-width: 1200px) {
      .container {
        width: 1170px;
      }
    }
    </style>
    </head><body>
    <div class="container">
    <div id="customerDetails">
    <h4>Customer Name: ${customerDetails.name}</h4>
    <h4>Customer Mobile: ${customerDetails.mobileNo}</h4>
    <h4>Customer City: ${customerDetails.city}</h4>
    </div>
    <table id="estimate">
  <tr>
    <th>S No</th>
    <th>Code</th>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Rate</th>
  </tr>
    ${salesProduct.map((e, i) => {
      return `
      <tr>
    <td>${i + 1}</td>
    <td>${e.productCode}</td>
    <td>${e.productName}</td>
    <td>${e.productQty}</td>
    <td>${e.productCost}</td>
  </tr>
      `;
    })}
    <tr>
    <td colspan="4" align="right">Sub Total</td>
    <td >Rs.${salesProduct.reduce(
      (a, b) => Number(b.productCost) * Number(b.productQty) + a,
      0
    )}</td>
    </tr>
    <tr>
    <td colspan="4" align="right">Discount</td>
    <td >${details.discount}%</td>
    </tr>
    <tr>
    <td colspan="4" align="right">Packing Charges</td>
    <td >Rs.${details.packingCharge}</td>
    </tr>
    <tr>
    <td colspan="4" align="right">Total</td>
    <td >Rs.${
      salesProduct.reduce(
        (a, b) => Number(b.productCost) * Number(b.productQty) + a,
        0
      ) -
      salesProduct.reduce(
        (a, b) => Number(b.productCost) * Number(b.productQty) + a,
        0
      ) *
        (Number(details.discount) / 100) +
      Number(details.packingCharge)
    }</td>
    </tr>
    </table>
    </div></body></html>`;
    document.body.innerHTML = html;
    window.print();
    document.body.innerHTML = oldPage;
    window.location.reload();
  };
  const [product, setProduct] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    customerID: "",
    name: "",
    mobileNo: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const getProduct = async (data = "") => {
    setIsLoading(true);
    await APIKit.post(URLS.getProduct, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const getCustomer = async (data = "") => {
    setIsLoading(true);
    await APIKit.get(URLS.getCustomer).then((res) => {
      if (res.data.status === 200) {
        setCustomerList(res.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  useEffect(() => {
    getProduct();
    getCustomer();
  }, []);
  let regEx = {
    numbersOnly: /^[0-9]*$/,
    numbWithoutLeadingZeros: /^(0|[1-9][0-9]{0,2})$/,
  };

  const initialValues = {
    productID: "",
    productCode: "",
    productName: "",
    productQty: "",
    productCost: "",
  };
  let editableKeyToFocus = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const [salesProduct, setSalesProduct] = useState([{ ...initialValues }]);
  const [details, setDetails] = useState({
    discount: "",
    packingCharge: "",
  });
  const [isDis, setIsDis] = useState(false);
  const checkCust = async (e) => {
    let item = { ...customerDetails };
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
  const createCustomer = async () => {
    const pay = { ...customerDetails };
    delete pay.customerID;
    if (pay.name === "" || pay.city === "") {
      variant = "error";
      enqueueSnackbar("Name and City is Mandatory", { variant, anchorOrigin });
      return;
    }
    await APIKit.post(URLS.addCustomer, pay).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        setIsDis(true);
        getCustomer();
        checkCust();
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };
  const matchProduct = (index) => {
    let item = [...salesProduct];
    var valueArr = salesProduct.map(function (item) {
      return item.productCode;
    });
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    if (isDuplicate) {
      editableKeyToFocus.current = `productCode${index}`;
      setSalesProduct([...salesProduct]);
      variant = "error";
      enqueueSnackbar("This Product Already Added", { variant, anchorOrigin });
      return;
    }
    for (var i = 0; i < product.length; i++) {
      if (product[i].productCode === item[index].productCode) {
        item[index].productName = product[i].productName;
        item[index].productCost = product[i].productCost;
        item[index].productID = product[i].productID;
        setSalesProduct([...item]);
        editableKeyToFocus.current = `productQty${index}`;
        break;
      } else {
        item[index].productName = "";
        item[index].productCost = "";
        item[index].productID = "";
        setSalesProduct([...item]);
      }
    }
    // product.map((e) => {
    //   if (e.productCode === item[index].productCode) {
    //     item[index].productName = e.productName;
    //     item[index].productCost = e.productCost;
    //     setSalesProduct([...item]);
    //     editableKeyToFocus.current = `productQty${index}`;
    //   }
    // });
    if (item[index].productName === "") {
      editableKeyToFocus.current = `productCode${index}`;
      setSalesProduct([...salesProduct]);
      variant = "error";
      enqueueSnackbar("Invalid Product Code", { variant, anchorOrigin });
      return;
    }
  };

  const addRemProduct = async (data, i) => {
    if (data === "add") {
      if (
        salesProduct[i].productQty === 0 ||
        salesProduct[i].productQty === ""
      ) {
        editableKeyToFocus.current = `productQty${i}`;
        setSalesProduct([...salesProduct]);
        variant = "error";
        enqueueSnackbar("Please give atleast 1 Qty", { variant, anchorOrigin });
        return;
      }
      if (salesProduct.length === i + 1) {
        let item = [...salesProduct];
        item.push(initialValues);
        setSalesProduct([...item]);
        editableKeyToFocus.current = `productCode${i + 1}`;
      } else {
        setSalesProduct([...salesProduct]);
        editableKeyToFocus.current = `productCode${i + 1}`;
      }
    } else {
      if (salesProduct.length > 1) {
        let item = [...salesProduct];
        item.splice(i, 1);
        setSalesProduct([...item]);
      }
    }
  };
  const saveSales = async () => {
    const pay = {
      customerID: customerDetails.customerID,
      totalNoofProducts: Number(salesProduct.length),
      subTotal: String(
        salesProduct.reduce(
          (a, b) => Number(b.productCost) * Number(b.productQty) + a,
          0
        )
      ),
      discount: Number(details.discount),
      packingCost: Number(details.packingCharge),
      total: String(
        salesProduct.reduce(
          (a, b) => Number(b.productCost) * Number(b.productQty) + a,
          0
        ) -
          salesProduct.reduce(
            (a, b) => Number(b.productCost) * Number(b.productQty) + a,
            0
          ) *
            (Number(details.discount) / 100) +
          Number(details.packingCharge)
      ),
      products: salesProduct.map((e) => {
        return {
          productID: e.productID,
          productQty: Number(e.productQty),
        };
      }),
    };
    await APIKit.post(URLS.addSales, pay).then((res) => {
      if (res.data.status === 200) {
        setSalesProduct([{ ...initialValues }]);
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
  };
  return (
    <Grid spacing={3} m={3}>
      <Loader isLoading={isLoading} />
      <Grid item sm={11} md={11}>
        <Typography
          color='black'
          gutterBottom
          variant='h6'
          sx={{
            p: "2px 4px",
            marginBottom: "10px",
            marginLeft: "20px",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            width: 200,
          }}>
          Estimate
        </Typography>

        <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2, mb: 4 }}>
          <Box
            sx={{
              p: 4,
            }}>
            <Grid container spacing={4}>
              <Grid item md={4} sm={12}>
                <TextField
                  id='outlined-basic'
                  label='Enter Customer Mobile Number'
                  name='mobileNo'
                  onChange={(e) => {
                    editableKeyToFocus.current = `mobileNo`;
                    setCustomerDetails({
                      ...customerDetails,
                      mobileNo: e.target.value.trim(),
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      checkCust();
                    }
                  }}
                  value={customerDetails.mobileNo}
                  fullWidth
                  variant='outlined'
                />
              </Grid>
              <Grid item md={4} sm={12}>
                <TextField
                  id='outlined-basic'
                  label='Enter Customer Name'
                  disabled={isDis}
                  name='name'
                  onChange={(e) => {
                    setCustomerDetails({
                      ...customerDetails,
                      name: e.target.value,
                    });
                  }}
                  fullWidth
                  value={customerDetails.name}
                  variant='outlined'
                />
              </Grid>
              <Grid item md={4} sm={12}>
                <TextField
                  id='outlined-basic'
                  label='Customer City'
                  name='city'
                  disabled={isDis}
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
                  fullWidth
                  value={customerDetails.city}
                  variant='outlined'
                />
              </Grid>
            </Grid>
          </Box>
        </Card>
        <TableContainer component={Paper} id='printme'>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>SNo</StyledTableCell>
                <StyledTableCell align='center'>Code</StyledTableCell>
                <StyledTableCell align='center'>Product Name</StyledTableCell>
                <StyledTableCell align='center'>Quantity</StyledTableCell>
                <StyledTableCell align='center'>Rate</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesProduct.map((data, i) => {
                return (
                  <StyledTableRow
                    key={i}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      addRemProduct("rem", i);
                    }}>
                    <StyledTableCell component='th' scope='row'>
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell align='center'>
                      <TextField
                        id='outlined-basic'
                        label='Product Code'
                        name={`productCode${i}`}
                        variant='outlined'
                        // onBlur={() => {
                        //   matchProduct(i)
                        // }}
                        onChange={(e) => {
                          editableKeyToFocus.current = `productCode${i}`;
                          let item = [...salesProduct];
                          item[i].productCode = e.target.value;
                          setSalesProduct([...item]);
                        }}
                        autoFocus={
                          `productCode${i}` === editableKeyToFocus.current
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
                    <StyledTableCell align='center'>
                      {data.productName}
                    </StyledTableCell>
                    <StyledTableCell align='center'>
                      <TextField
                        label='Product Quantity'
                        id='outlined-basic'
                        name={`productQty${i}`}
                        variant='outlined'
                        type='number'
                        // onBlur={() => {
                        //   addRemProduct("add",i)
                        // }}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            regEx.numbWithoutLeadingZeros.test(e.target.value)
                          ) {
                            editableKeyToFocus.current = `productQty${i}`;
                            let item = [...salesProduct];
                            item[i].productQty = e.target.value;
                            setSalesProduct([...item]);
                          }
                        }}
                        autoFocus={
                          `productQty${i}` === editableKeyToFocus.current
                        }
                        value={data.productQty}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            console.log("add", e);
                            addRemProduct("add", i);
                          }
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align='center'>
                      {data.productQty !== ""
                        ? data.productQty * data.productCost
                        : data.productCost}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              <StyledTableRow>
                <StyledTableCell colSpan={4} align='right'>
                  Subtotal
                </StyledTableCell>
                <StyledTableCell align='center'>
                  {salesProduct.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  )}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell colSpan={4} align='right'>
                  Discount
                </StyledTableCell>
                <StyledTableCell align='center'>
                  <FormControl variant='standard'>
                    <InputLabel htmlFor='standard-adornment-amount'>
                      Percentage
                    </InputLabel>
                    <Input
                      id='standard-adornment-amount'
                      startAdornment={
                        <InputAdornment position='start'>%</InputAdornment>
                      }
                      name={`discount`}
                      autoFocus={`discount` === editableKeyToFocus.current}
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
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell colSpan={4} align='right'>
                  Packing Charge
                </StyledTableCell>
                <StyledTableCell align='center'>
                  <FormControl variant='standard'>
                    <InputLabel htmlFor='standard-adornment-amount'>
                      Amount
                    </InputLabel>
                    <Input
                      id='standard-adornment-amount'
                      name={`packingCharge`}
                      autoFocus={`packingCharge` === editableKeyToFocus.current}
                      onChange={(e) => {
                        editableKeyToFocus.current = `packingCharge`;
                        setDetails({
                          ...details,
                          packingCharge: e.target.value,
                        });
                      }}
                      value={details.packingCharge}
                      startAdornment={
                        <InputAdornment position='start'>Rs</InputAdornment>
                      }
                    />
                  </FormControl>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell colSpan={4} align='right'>
                  Total
                </StyledTableCell>
                <StyledTableCell align='center'>
                  {salesProduct.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  ) -
                    salesProduct.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) *
                      (Number(details.discount) / 100) +
                    Number(details.packingCharge)}
                </StyledTableCell>
              </StyledTableRow>
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
          }}>
          <ButtonGroup variant='outlined' aria-label='outlined button group'>
            <Button onClick={saveSales}>Save</Button>
            <Button>View</Button>
            <Button onClick={printFun}>Print</Button>
          </ButtonGroup>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Sales;
