import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import APIKit from "../../../utilities/APIKIT";
import { MESSAGE } from "../../../utilities/constant";
import { URLS } from "../../../utilities/URLS";

export default function CreateProduct() {
  const productData = useSelector((x) => x.NavigationData.navigationData);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  let regEx = {
    numbersOnly: /^[0-9]*$/,
  };
  // const [brandData, setBrandData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const matches = useMediaQuery("(min-width:600px)");

  // const getBrand = async (data = "") => {
  //   await APIKit.post(URLS.getBrand, { searchText: data }).then((res) => {
  //     if (res.data.status === 200) {
  //       setBrandData(res.data.data);
  //     }
  //   });
  // };
  const getProductCategory = async (data = "") => {
    await APIKit.post(URLS.getProductCategory, { searchText: data }).then(
      (res) => {
        if (res.data.status === 200) {
          setProductCategoryData(res.data.data);
        }
      }
    );
  };
  const createProduct = async () => {
    const pay = { ...payload };
    delete pay.productCategoryName;
    delete pay.brandName;
    if (pay.productCategory === "") {
      variant = "error";
      enqueueSnackbar("Product Category is Mandatory", {
        variant,
        anchorOrigin,
      });
      return;
    }
    await APIKit.post(URLS.addProduct, pay).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.data, { variant, anchorOrigin });
        setPayload({
          productName: "",
          productCode: "",
          productCategory: "",
          // brand: "",
          // productQty: "",
          productCost: "",
          productCategoryName: "",
          brandName: "",
        });
        navigate("/app/product/", { replace: true });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message.slice(21), { variant, anchorOrigin });
      }
    });
  };
  const updateProduct = async () => {
    const pay = { ...payload };
    pay.productID = productData.productID;
    delete pay.productCategoryName;
    delete pay.brandName;
    if (pay.productCategory === "") {
      variant = "error";
      enqueueSnackbar("Product Category is Mandatory", {
        variant,
        anchorOrigin,
      });
      return;
    }
    await APIKit.put(URLS.updateProduct, pay).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.data, { variant, anchorOrigin });
        setPayload({
          productName: "",
          productCode: "",
          productCategory: "",
          // brand: "",
          // productQty: "",
          productCost: "",
          productCategoryName: "",
          brandName: "",
        });
        navigate("/app/product/", { replace: true });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message.slice(21), { variant, anchorOrigin });
      }
    });
  };
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    if (Object.keys(productData).length) {
      setIsEdit(true);
      setPayload({
        productName: productData.productName,
        productCode: productData.productCode,
        productCategory: productData.productCategory,
        // brand: productData.brand,
        // productQty: productData.productQty,
        productCost: productData.productCost,
        productCategoryName: productData.productCategoryName,
        brandName: productData.brandName,
      });
    }
    getProductCategory();
    // eslint-disable-next-line
  }, []);
  const [payload, setPayload] = useState({
    productName: "",
    productCode: "",
    productCategory: "",
    // brand: "",
    // productQty: "",
    productCost: "",
    productCategoryName: "",
    brandName: "",
  });

  const back = () => {
    navigate("/app/product/", { replace: true });
  };
  return (
    <div>
      <Box
        sx={{
          p: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Typography
          color='black'
          gutterBottom
          variant='h6'
          sx={{
            p: "2px 4px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            width: 200,
          }}>
          Create Product
        </Typography>

        <Button
          sx={{
            height: 50,
          }}
          onClick={back}
          variant='contained'>
          Back
        </Button>
      </Box>
      <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2 }}>
        <Box
          sx={{
            p: 4,
          }}>
          <Formik
            initialValues={{ ...payload }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              productName: Yup.string().required(MESSAGE.productName),
              productCode: Yup.string().required(MESSAGE.productCode),
              // productQty: Yup.number().required(MESSAGE.quantity),
              productCost: Yup.number().required(MESSAGE.cost),
            })}
            onSubmit={(values) => {
              // same shape as initial values
              if (isEdit) {
                updateProduct();
              } else {
                createProduct();
              }
            }}>
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form autoComplete='off' onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                <Grid item md={4} sm={12}>
                    <TextField
                      error={Boolean(
                        touched.productCode && errors.productCode && (
                          <div>{errors.productCode}</div>
                        )
                      )}
                      helperText={touched.productCode && errors.productCode}
                      onBlur={handleBlur}
                      value={payload.productCode}
                      onChange={(e) => {
                        handleChange(e);
                        setPayload({
                          ...payload,
                          productCode: e.target.value,
                        });
                      }}
                      id='outlined-basic'
                      label='Product Code'
                      name='productCode'
                      fullWidth
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item md={4} sm={12}>
                    <TextField
                      error={Boolean(
                        touched.productName && errors.productName && (
                          <div>{errors.productName}</div>
                        )
                      )}
                      helperText={touched.productName && errors.productName}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        setPayload({
                          ...payload,
                          productName: e.target.value,
                        });
                      }}
                      id='outlined-basic'
                      label='Enter Product Name'
                      name='productName'
                      fullWidth
                      value={payload.productName}
                      variant='outlined'
                    />
                  </Grid>
                  

                  <Grid item md={4} sm={12}>
                    <Autocomplete
                      id='combo-box-demo'
                      isOptionEqualToValue={(option, value) =>
                        option.productCategoryID === value.productCategoryID
                      }
                      options={productCategoryData}
                      getOptionLabel={(option) => option.productCategoryName}
                      fullWidth
                      onChange={(e, value, reason) => {
                        if (reason === "clear") {
                          setPayload({
                            ...payload,
                            productCategory: "",
                            productCategoryName: "",
                          });
                        } else {
                          setPayload({
                            ...payload,
                            productCategory: value.productCategoryID,
                            productCategoryName: value.productCategoryName,
                          });
                        }
                      }}
                      value={{
                        productCategoryID: payload.productCategory,
                        productCategoryName: payload.productCategoryName,
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={!matches && { width: 170 }}
                          {...params}
                          label='Product Category'
                        />
                      )}
                      name='productCategory'
                      variant='outlined'
                    />
                  </Grid>
                  {/* <Grid item md={4} sm={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      isOptionEqualToValue={(option, value) =>
                        option.brandID === value.brandID
                      }
                      options={brandData}
                      value={{
                        brandID: payload.brand,
                        brandName: payload.brandName,
                      }}
                      getOptionLabel={(option) => option.brandName}
                      fullWidth
                      onChange={(e, value, reason) => {
                        if (reason === "clear") {
                          setPayload({
                            ...payload,
                            brand: "",
                            brandName: "",
                          });
                        } else {
                          setPayload({
                            ...payload,
                            brand: value.brandID,
                            brandName: value.brandName,
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={!matches && { width: 170 }}
                          {...params}
                          label="Brand"
                        />
                      )}
                      name="brand"
                      variant="outlined"
                    />
                  </Grid> */}
                  {/* <Grid item md={4} sm={12}>
                    <TextField
                      id='outlined-basic'
                      label='Quantity'
                      name='productQty'
                      value={payload.productQty}
                      fullWidth
                      variant='outlined'
                      error={Boolean(
                        touched.productQty && errors.productQty && (
                          <div>{errors.productQty}</div>
                        )
                      )}
                      helperText={touched.productQty && errors.productQty}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        if (
                          e.target.value === "" ||
                          regEx.numbersOnly.test(e.target.value)
                        ) {
                          handleChange(e);
                          setPayload({
                            ...payload,
                            productQty: e.target.value.trim(),
                          });
                        }
                      }}
                    />
                  </Grid> */}
                  <Grid item mdOffset={4} md={4} sm={12}>
                    <TextField
                      error={Boolean(
                        touched.productCost && errors.productCost && (
                          <div>{errors.productCost}</div>
                        )
                      )}
                      helperText={touched.productCost && errors.productCost}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        if (
                          e.target.value === "" ||
                          regEx.numbersOnly.test(e.target.value)
                        ) {
                          handleChange(e);
                          setPayload({
                            ...payload,
                            productCost: String(e.target.value),
                          });
                        }
                      }}
                      value={payload.productCost}
                      id='outlined-basic'
                      label='Enter Product Cost'
                      name='productCost'
                      fullWidth
                      variant='outlined'
                    />
                  </Grid>
                  <Button
                    sx={{
                      marginLeft: "auto",
                      mt: 2,
                    }}
                    type='submit'
                    variant='contained'>
                    {isEdit ? "Update" : "Save"}
                  </Button>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Card>
    </div>
  );
}
