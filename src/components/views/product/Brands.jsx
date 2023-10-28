import { Box, Grid } from "@mui/material";
import React from "react";
import CommonTable from "../common/CommonTable";
import { ETaction, ETTypes } from "../common/Types";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { URLS } from "../../utilities/URLS";
import APIKit from "../../utilities/APIKIT";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import Loader from "../common/CommonLoader";

function Brands(props) {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const [payload, setPayload] = useState({
    brandName: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [brandData, setBrandData] = useState([]);

  const matches = useMediaQuery("(min-width:600px)");
  const brandColumn = [
    {
      title: "SNo",
      align: "center",
      type: ETTypes.SNo,
    },
    {
      title: "Brand Name",
      field: "brandName",
      align: "center",
      type: ETTypes.string,
    },

    {
      title: "Action",
      field: "action",
      align: "center",
      list: [ETaction.onView, ETaction.onDelete, ETaction.onEdit],
    },
  ];
  useEffect(() => {
    getBrand();
  }, []);

  const actions = {
    onView: (index, row) => {},

    onEdit: (index, row) => {
      setIsEdit(true);
      setPayload({
        brandName: row.brandName,
        brandID: row.brandID,
      });
    },
    onDelete: (index, row) => {
      console.log("delete:", index, row);
      remove(row.brandID, index);
    },
  };
  const remove = (data, i) => {
    confirm({ description: "you want to delete the record ?" })
      .then(() => {
        deleteBrand(data);
      })
      .catch(() => console.log("Deletion cancelled."));
  };
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const createBrand = async () => {
    await APIKit.post(URLS.addBrand, payload).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayload({ brandName: "" });
        getBrand();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };
  const updateBrand = async () => {
    await APIKit.put(URLS.updateBrand, payload).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayload({ brandName: "" });
        setIsEdit(false);
        getBrand();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };

  const deleteBrand = async (brandID) => {
    await APIKit.get(URLS.deleteBrand + "/" + brandID).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        getBrand();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message.slice(21), { variant, anchorOrigin });
      }
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const getBrand = async (data = "") => {
    setIsLoading(true);
    await APIKit.post(URLS.getBrand, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setBrandData(res.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

  return (
    <Grid m={3}>
      <Loader isLoading={isLoading} />
      <Grid item sm={11} md={11}>
        <Box
          sx={{
            p: "0px 0px 20px",
            display: matches && "flex",
            justifyContent: "space-between",
          }}>
          <TextField
            autoComplete='off'
            sx={{ mt: 2, width: matches ? 300 : 200 }}
            id='outlined-basic'
            label='Brand Category'
            name='brandName'
            value={payload.brandName}
            variant='outlined'
            onChange={(e) => {
              setPayload({
                ...payload,
                brandName: e.target.value.trim(),
              });
            }}
          />

          <Stack spacing={2} direction={matches ? "row" : "column"}>
            {isEdit ? (
              <Box sx={{ mt: 2 }}>
                <Button
                  sx={{ height: 50 }}
                  onClick={updateBrand}
                  variant='contained'
                  disabled={!payload.brandName}>
                  Update Brand
                </Button>{" "}
                <Button
                  sx={{ height: 50 }}
                  onClick={() => {
                    setIsEdit(false);
                    setPayload({ brandName: "" });
                  }}
                  variant='contained'>
                  Cancel
                </Button>{" "}
              </Box>
            ) : (
              <Button
                sx={{ height: 50, mt: 2 }}
                onClick={createBrand}
                variant='contained'
                disabled={!payload.brandName}>
                Add Brand
              </Button>
            )}
          </Stack>
        </Box>
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
              getBrand(e.target.value);
            }}
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton type='button' sx={{ p: "10px" }} aria-label='search'>
            <SearchIcon />
          </IconButton>
        </Paper>
        <CommonTable columns={brandColumn} data={brandData} action={actions} />
      </Grid>
    </Grid>
  );
}

export default Brands;
