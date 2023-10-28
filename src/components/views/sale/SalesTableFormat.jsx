import AddIcon from "@mui/icons-material/Add";
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
import Select from "react-select";
import APIKit from "../../utilities/APIKIT";
import { MESSAGE } from "../../utilities/constant";
import { URLS } from "../../utilities/URLS";

function SalesTableFormat(props) {
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
          productID: Number(e.productID),
          productQty: Number(e.productQty),
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
  const initialValues = {
    productCode: "",
    productName: "",
    productQty: "",
    packingCost: "",
    productID: "",
    isDiscount: true,
  };
  const [salesData, setSalesData] = useState([]);
 
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
  useEffect(() => {
    getCustomer();
    getProduct();
  }, []);
  const [product, setProduct] = useState([]);
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
  function matchProduct(data) {
    let item = [...salesData];
    var valueArr = salesData.map(function (item) {
      return item.productCode;
    });
    var isDuplicate = valueArr.some((e) => e === data.value);
    if (isDuplicate) {
      variant = "error";
      enqueueSnackbar("This Product Already Added", { variant, anchorOrigin });
      return;
    }
    item.push(initialValues);
    product.map((e) => {
      if (e.productCode === data.value) {
        item[item.length - 1].productQty = 1;
        item[item.length - 1].productCode = e.productCode;
        item[item.length - 1].productName = e.productName;
        item[item.length - 1].productCost = e.productCost;
        item[item.length - 1].productID = e.productID;
        setSalesData([...item]);
      }
    });
    editableKeyToFocus.current = `productQty${salesData.length}`;
  }
  const [details, setDetails] = useState({
    discount: "",
    packingCharge: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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
      }
    }
    // eslint-disable-next-line
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
                            Product Name (Code)
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Quantity
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Rate Per Unit
                          </StyledTableCell>
                          <StyledTableCell align="center">Rate</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesData.map((data, i) => {
                          return (
                            <StyledTableRow>
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
                                {data.productName} ({data.productCode})
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
                                      if (data.productQty === 0) {
                                        let item = [...salesData];
                                        data.productQty === 0
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
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item md={4} sm={12}>
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
                        value: e.productCode,
                        label: e.productName + " (" + e.productCode + ")",
                      };
                    })}
                  />
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
                      <Button onClick={saveSales}>Save</Button>
                      <Button>View</Button>
                      <Button>Print</Button>
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

export default SalesTableFormat;
