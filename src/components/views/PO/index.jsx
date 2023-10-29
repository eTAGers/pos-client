import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { AutoComplete } from "../../utilities/formLib";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Typography from "@mui/material/Typography";
import APIKit from "../../utilities/APIKIT";
import { URLS } from "../../utilities/URLS";
import GenericDialog from "../../utilities/Dialog";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { MESSAGE } from "../../utilities/constant";
import Button from "@mui/material/Button";
import CommonTable from "../common/CommonTable";
import { ETTypes } from "../common/Types";

function PO(props) {
  const poColumn = [
    {
      title: "SNo",
      align: "center",
      type: ETTypes.SNo,
    },
    {
      title: "Dealer Name",
      field: "Dealer_Name",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Product Name",
      field: "Product_Name",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Product Quantity",
      field: "Quantity",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Created Date",
      field: "Created_Date",
      align: "center",
      type: ETTypes.date,
    },
  ];
  const navigate = useNavigate();
  const handleAddClick = () => {
    setOpen(true);
  };
  const [dealers, setdealer] = React.useState([]);
  const [po, setPO] = React.useState([]);
  const getPO = async () => {
    await APIKit.get(URLS.getPO).then((res) => {
      if (res.data.status === 200) {
        setPO(res.data.data);
      } else {
      }
    });
  };
  const getDealer = async () => {
    await APIKit.get(URLS.getDealer).then((res) => {
      if (res.data.status === 200) {
        setdealer(res.data.data);
      } else {
      }
    });
  };
  React.useEffect(() => {
    getDealer();
    getProduct();
    getPO();
  }, []);
  const [open, setOpen] = React.useState(false);
  const [payloadDealer, setPayloadDelaer] = React.useState({
    dealerName: "",
  });
  const [payload, setPayload] = React.useState({
    dealerId: "",
    productID: "",
    productQty: "",
  });
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleAddProduct = () => {
    navigate("/app/product/create_product/", { replace: true });
  };
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const onSubmitDealer = async () => {
    const pay = { ...payloadDealer };
    await APIKit.post(URLS.addDealer, pay).then((res) => {
      if (res.data.message === "Successfully added") {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayloadDelaer({ dealerName: "" });
        setOpen(false);
        getDealer();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };

  const [product, setProduct] = React.useState([]);
  const getProduct = async (data = "") => {
    await APIKit.post(URLS.getProduct, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setProduct(res.data.data);
      } else {
      }
    });
  };
  const handleAddPo = async () => {
    const pay = {
      dealerID: payload.dealerId,
      productQuantity: payload.productQty,
      productID: payload.productID,
    };
    await APIKit.post(URLS.addPO, pay).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayload({ dealerId: "", productID: "", productQty: "" });
        getPO();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };
  return (
    <div>
      <Grid spacing={3}>
        <Grid item sm={12} md={12}>
          <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2, mb: 4 }}>
            <Box
              sx={{
                p: 4,
              }}
            >
              <Formik
                initialValues={{ ...payload }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                  dealerId: Yup.string().required(MESSAGE.dealer),
                  productID: Yup.string().required(MESSAGE.productName),
                  productQty: Yup.number().required(MESSAGE.quantity),
                })}
                onSubmit={(values) => {
                  // same shape as initial values
                  handleAddPo();
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form autoComplete="off" onSubmit={handleSubmit}>
                    <Grid container spacing={6}>
                      <Grid item md={4} sm={12}>
                        <AutoComplete
                          id="outlined-basic"
                          label="Dealer"
                          name="dealerId"
                          error={Boolean(
                            touched.dealerId && errors.dealerId && (
                              <div>{errors.dealerId}</div>
                            )
                          )}
                          helperText={touched.dealerId && errors.dealerId}
                          autoFocus
                          options={dealers.map((e) => {
                            return {
                              label: e.dealer_name,
                              value: e.dealer_id,
                            };
                          })}
                          onBlur={handleBlur}
                          noOptionsText={
                            <>
                              <div
                                onMouseDown={handleAddClick}
                                style={{ display: "flex", cursor: "pointer" }}
                              >
                                <AddBoxIcon style={{ color: "green" }} />
                                <Typography
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    color: "black",
                                    marginLeft: "5px",
                                  }}
                                >
                                  Create Dealer
                                </Typography>
                              </div>
                            </>
                          }
                          onChange={(e, data) => {
                            handleChange(e);
                            setPayload({
                              ...payload,
                              dealerId: data?.value,
                            });
                          }}
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={4} sm={12}>
                        <AutoComplete
                          id="outlined-basic"
                          label="Products"
                          name="productID"
                          value={product.find(
                            (e) => e.productID === payload.productID
                          )}
                          error={Boolean(
                            touched.productID && errors.productID && (
                              <div>{errors.productID}</div>
                            )
                          )}
                          onBlur={handleBlur}
                          helperText={touched.productID && errors.productID}
                          options={product.map((e) => {
                            return {
                              label: e.productName,
                              value: e.productID,
                            };
                          })}
                          noOptionsText={
                            <>
                              <div
                                onMouseDown={handleAddProduct}
                                style={{ display: "flex", cursor: "pointer" }}
                              >
                                <AddBoxIcon style={{ color: "green" }} />
                                <Typography
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    color: "black",
                                    marginLeft: "5px",
                                  }}
                                >
                                  Create Product
                                </Typography>
                              </div>
                            </>
                          }
                          onChange={(e, data) => {
                            handleChange(e);
                            setPayload({
                              ...payload,
                              productID: data?.value,
                            });
                          }}
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item md={4} sm={12}>
                        <TextField
                          id="outlined-basic"
                          label="Product Qty"
                          name="productQty"
                          error={Boolean(
                            touched.productQty && errors.productQty && (
                              <div>{errors.productQty}</div>
                            )
                          )}
                          helperText={touched.productQty && errors.productQty}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setPayload({
                              ...payload,
                              productQty: e.target.value.trim(),
                            });
                          }}
                          value={payload.productQty}
                          fullWidth
                          variant="outlined"
                        />
                      </Grid>
                      {/* <Grid item sm={12} md={12}> */}
                      <Button
                        sx={{
                          marginLeft: "auto",
                          mt: 2,
                          mb: 2,
                        }}
                        type="submit"
                        variant="contained"
                      >
                        Save
                      </Button>
                      {/* </Grid> */}
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12}>
                        <Box
                        // sx={{
                        //   p: "20px",
                        //   display: "flex",
                        //   justifyContent: "space-between",
                        // }}
                        >
                          <CommonTable columns={poColumn} data={po} />
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <GenericDialog
        onSubmit={onSubmitDealer}
        onClose={handleCloseDialog}
        open={open}
        title={`Create Dealer`}
        buttonText={"Submit"}
        content={
          <Grid container spacing={2}>
            <Grid item md={4} sm={12}>
              <TextField
                id="outlined-basic"
                label="Dealer Name"
                name="dealerName"
                onChange={(e) => {
                  setPayloadDelaer({
                    ...payloadDealer,
                    dealerName: e.target.value.trim(),
                  });
                }}
                value={payloadDealer.dealerName}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        }
      />
    </div>
  );
}

export default PO;
