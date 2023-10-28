import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNavigationData } from "../../Redux/Common/action";
import APIKit from "../../utilities/APIKIT";
import { URLS } from "../../utilities/URLS";
import Loader from "../common/CommonLoader";
import CommonTable from "../common/CommonTable";
import { ETaction, ETTypes } from "../common/Types";

function Product(props) {
  var userData = JSON.parse(sessionStorage.getItem("userData"))
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const matches = useMediaQuery("(min-width:600px)");
  const actions = {
    onView: (index, row) => {},
    onEdit: async (index, row) => {
      await dispatch(getNavigationData(row));
      navigate("/app/product/create_product/", { replace: true });
    },
    onDelete: (index, row) => {
      console.log(row);
      remove(row.productID, index);
    },
  };
  const remove = (data, i) => {
    confirm({ description: "you want to delete the record ?" })
      .then(() => {
        deleteProduct(data);
      })
      .catch(() => console.log("Deletion cancelled."));
  };
  const deleteProduct = async (productID) => {
    await APIKit.get(URLS.deleteProduct + "/" + productID).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        getProduct();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };
  useEffect(() => {
    getProduct();
  }, []);
  const [product, setProduct] = useState([]);
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
  const productColumn = [
    {
      title: "SNo",
      align: "center",
      type: ETTypes.SNo,
    },
    userData.storeID === 0 && {
      title: "Store Name",
      field: "storeName",
      align: "center",
      type: ETTypes.string,
    }
    ,
    {
      title: "Product",
      field: "productName",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Code",
      field: "productCode",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Product Category",
      field: "productCategoryName",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Price",
      field: "productCost",
      align: "center",
      type: ETTypes.string,
    },

    {
      title: "Created On",
      field: "createdDate",
      align: "center",
      type: ETTypes.date,
    },
    {
      title: "Action",
      field: "action",
      align: "center",
      list: [ETaction.onView, ETaction.onDelete, ETaction.onEdit],
    },
  ];

  const headers = productColumn
    .filter((e) => e.title !== "SNo" && e.title !== "Action")
    .map((e) => {
      return {
        label: e.title,
        key: e.field ?? "",
      };
    });

  const createProduct = async () => {
    const data = {};
    await dispatch(getNavigationData(data));
    navigate("/app/product/create_product/", { replace: true });
  };
  return (
    <Grid spacing={3} m={3}>
      <Loader isLoading={isLoading} />
      <Grid item sm={11} md={11}>
        <Box
          sx={{
            p: "20px",
            display: matches && "flex",
            justifyContent: "space-between",
          }}>
          <Paper
            component='form'
            sx={{
              p: "2px 4px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              width: matches ? 300 : 200,
            }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder='Search'
              onChange={(e) => {
                getProduct(e.target.value);
              }}
              inputProps={{ "aria-label": "search google maps" }}
            />
            <IconButton type='button' sx={{ p: "10px" }} aria-label='search'>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Stack spacing={2} direction={matches ? "row" : "column"}>
            <Button sx={{ height: 50 }} variant='contained'>
              <CSVLink
                filename={"Products.csv"}
                style={{ color: "white" }}
                data={product}
                headers={headers}>
                Export Products
              </CSVLink>
            </Button>
            <Button sx={{ height: 50 }} variant='contained'>
              Import Products
            </Button>
            <Button
              sx={{ height: 50 }}
              onClick={createProduct}
              variant='contained'>
              Create Products
            </Button>
          </Stack>
        </Box>
        <CommonTable columns={productColumn} data={product} action={actions} />
      </Grid>
    </Grid>
  );
}

export default Product;
