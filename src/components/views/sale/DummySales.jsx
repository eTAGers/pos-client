import React, { useState, useEffect, useRef } from "react";
import APIKit from "../../utilities/APIKIT";
import { URLS } from "../../utilities/URLS";
import { useSnackbar } from "notistack";
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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { MESSAGE } from "../../utilities/constant";
function DummySales() {
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
  const [customerList, setCustomerList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    customerID: "",
    name: "",
    mobileNo: "",
    city: "",
  });
  const getCustomer = async (data = "") => {
    await APIKit.get(URLS.getCustomer).then((res) => {
      if (res.data.status === 200) {
        setCustomerList(res.data.data);
      } else {
      }
    });
  };
  useEffect(() => {
    getCustomer();
    getProduct();
  }, []);
  let editableKeyToFocus = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const [details, setDetails] = useState({
    discount: "",
    packingCharge: "",
    estimateNum: "",
  });
  const initialValues = {
    productID: "",
    productCode: "",
    productName: "",
    productQty: "",
    productCost: "",
    isDis: true,
  };
  const [salesProduct, setSalesProduct] = useState([{ ...initialValues }]);
  const [product, setProduct] = useState([]);
  const getProduct = async (data = "") => {
    await APIKit.post(URLS.getProduct, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.data);
      } else {
      }
    });
  };
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
  let regEx = {
    numbersOnly: /^[0-9]*$/,
    numbWithoutLeadingZeros: /^(0|[1-9][0-9]{0,2})$/,
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
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
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
        item[index].isDis = true;
        setSalesProduct([...item]);
        editableKeyToFocus.current = `productQty${index}`;
        break;
      } else {
        item[index].productName = "";
        item[index].productCost = "";
        item[index].productID = "";
        item[index].isDis = false;
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
    if (item[index].productCode === "") {
      editableKeyToFocus.current = `productCode${index}`;
      setSalesProduct([...salesProduct]);
      variant = "error";
      enqueueSnackbar("Enter Product Code", { variant, anchorOrigin });
      return;
    }
    if (item[index].productName === "") {
      editableKeyToFocus.current = `productName${index}`;
      setSalesProduct([...salesProduct]);
      variant = "error";
      enqueueSnackbar("Invalid Product Code", { variant, anchorOrigin });
      return;
    }
  };

  const addRemProduct = async (data, i) => {
    if (data === "add") {
      if (
        salesProduct[i].productCost === 0 ||
        salesProduct[i].productCost === ""
      ) {
        editableKeyToFocus.current = `productCost${i}`;
        setSalesProduct([...salesProduct]);
        variant = "error";
        enqueueSnackbar("Please give rate", { variant, anchorOrigin });
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
  const addDummySales = async () => {
    const pay = {
        estimateNum: Number(details.estimateNum),
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
          salesProduct
              .reduce(
                (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                0
              ) *
              (Number(details.discount) / 100) +
            Number(details.packingCharge)
        ),
        products: salesProduct.map((e) => {
          return {
            productCode: e.productCode,
            productName: e.productName,
            productCost: Number(e.productCost),
            productQty: Number(e.productQty),
          };
        }),
      };
      if (pay.customerID === "") {
        variant = "error";
        enqueueSnackbar(MESSAGE.custDetails, { variant, anchorOrigin });
        return;
      }
      if (!salesProduct.length) {
        variant = "error";
        enqueueSnackbar(MESSAGE.noProducts, { variant, anchorOrigin });
        return;
      }
      await APIKit.post(URLS.addDummySales, pay).then((res) => {
        if (res.data.status === 200) {
          setSalesProduct([{ ...initialValues }]);
          setDetails({
            discount: "",
            packingCharge: "",
            estimateNum: ""
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
  return (
    <div>
      <Grid spacing={3} m={3}>
        <Grid item sm={11} md={11}>
          <Typography
            color="black"
            gutterBottom
            variant="h6"
            sx={{
              p: "2px 4px",
              marginBottom: "10px",
              marginLeft: "20px",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              width: 200,
            }}
          >
            Dummy Sales{" "}
            <TextField
              variant="outlined"
              style={{ width: 100 }}
              name="estimateNum"
              label="Estimate Number"
              autoFocus
              value={details.estimateNum}
              onChange={(e) => {
                if (
                  e.target.value === "" ||
                  regEx.numbersOnly.test(e.target.value)
                ) {
                  setDetails({
                    ...details,
                    estimateNum: e.target.value.trim(),
                  });
                }
              }}
            />
          </Typography>

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
              </Grid>
            </Box>
          </Card>
          <TableContainer component={Paper} id="printme">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">SNo</StyledTableCell>
                  <StyledTableCell align="center">Code</StyledTableCell>
                  <StyledTableCell align="center">Product Name</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">
                    Rate Per Unit
                  </StyledTableCell>
                  <StyledTableCell align="center">Sub Total</StyledTableCell>
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
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {i + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TextField
                          id="outlined-basic"
                          label="Product Code"
                          name={`productCode${i}`}
                          variant="outlined"
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
                      <StyledTableCell align="center">
                        <TextField
                          id="outlined-basic"
                          label="Product Name"
                          disabled={data.isDis}
                          name={`productName${i}`}
                          variant="outlined"
                          // onBlur={() => {
                          //   matchProduct(i)
                          // }}
                          onChange={(e) => {
                            editableKeyToFocus.current = `productName${i}`;
                            let item = [...salesProduct];
                            item[i].productName = e.target.value;
                            setSalesProduct([...item]);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              console.log("hi");
                              setSalesProduct([...salesProduct]);
                              editableKeyToFocus.current = `productQty${i}`;
                            }
                          }}
                          autoFocus={
                            `productName${i}` === editableKeyToFocus.current
                          }
                          value={data.productName}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TextField
                          label="Product Quantity"
                          id="outlined-basic"
                          name={`productQty${i}`}
                          variant="outlined"
                          type="number"
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
                              setSalesProduct([...salesProduct]);
                              editableKeyToFocus.current = `productCost${i}`;
                            }
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TextField
                          label="Product Cost"
                          id="outlined-basic"
                          name={`productCost${i}`}
                          variant="outlined"
                          // onBlur={() => {
                          //   addRemProduct("add",i)
                          // }}
                          onChange={(e) => {
                            if (
                              e.target.value === "" ||
                              regEx.numbWithoutLeadingZeros.test(e.target.value)
                            ) {
                              editableKeyToFocus.current = `productCost${i}`;
                              let item = [...salesProduct];
                              item[i].productCost = e.target.value;
                              setSalesProduct([...item]);
                            }
                          }}
                          autoFocus={
                            `productCost${i}` === editableKeyToFocus.current
                          }
                          value={data.productCost}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addRemProduct("add", i);
                            }
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.productQty !== ""
                          ? data.productQty * data.productCost
                          : data.productCost}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="right">
                    Subtotal
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {salesProduct.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    )}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="right">
                    Discount
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <FormControl variant="standard">
                      <InputLabel htmlFor="standard-adornment-amount">
                        Percentage
                      </InputLabel>
                      <Input
                        id="standard-adornment-amount"
                        startAdornment={
                          <InputAdornment position="start">%</InputAdornment>
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
                  <StyledTableCell colSpan={5} align="right">
                    Packing Charge
                  </StyledTableCell>
                  <StyledTableCell align="center">
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
                          <InputAdornment position="start">Rs</InputAdornment>
                        }
                      />
                    </FormControl>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="right">
                    Total
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {salesProduct.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
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
            }}
          >
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button onClick={addDummySales}>Save</Button>
              <Button>View</Button>
              <Button>Print</Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default DummySales;
