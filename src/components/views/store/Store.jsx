import { Box, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
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
import { URLS } from "../../utilities/URLS";
import APIKit from "../../utilities/APIKIT";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import Loader from "../common/CommonLoader";

function Store(props) {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const [payload, setPayload] = useState({
    storeName: "",
    isActive: 0,
  });
  const matches = useMediaQuery("(min-width:600px)");
  const [storeData, setStoreData] = useState([]);
  const storeColumn = [
    {
      title: "SNo",
      align: "center",
      type: ETTypes.SNo,
    },
    {
      title: " Store",
      field: "storeName",
      align: "center",
      type: ETTypes.string,
    },

    {
      title: "Action",
      field: "action",
      align: "center",
      list: [ETaction.onDelete, ETaction.onEdit],
    },
    {
      title: "On/Off",
      field: "action",
      align: "center",
      list: [ETaction.onOff],
    },
  ];

  useEffect(() => {
    getStore();
  }, []);
  const [isEdit, setIsEdit] = useState(false);

  const actions = {
    onOff: async (index, row) => {
      
      updateStoreOnOff(row);
    },

    onEdit: (index, row) => {
      setIsEdit(true);
      setPayload({
        storeName: row.storeName,
        storeID: row.storeID,
        isActive: row.isActive,
      });
    },
    onDelete: (index, row) => {
      remove(row.storeID, index);
    },
  };
  const remove = (data, i) => {
    confirm({ description: "you want to delete the record ?" })
      .then(() => {
        deleteStore(data);
      })
      .catch(() => console.log("Deletion cancelled."));
  };
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const createStore = async () => {
    await APIKit.post(URLS.addStore, payload).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayload({ storeName: "" });
        getStore();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };
  const updateStore = async () => {
    const pay = {
      storeID: payload.storeID,
      storeName: payload.storeName,
      isActive: payload.isActive,
    };
    await APIKit.put(URLS.updateStore, payload).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayload({ storeName: "" });
        setIsEdit(false);
        getStore();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };

  const updateStoreOnOff = async (row) => {
    const pay = {
      storeID: row.storeID,
      storeName: row.storeName,
      ...(row.isActive === 0 && { isActive: 1 }),
      ...(row.isActive === 1 && { isActive: 0 }),
    };
    await APIKit.put(URLS.updateStore, pay).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        setPayload({ storeName: "" });
        setIsEdit(false);
        getStore();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };

  const deleteStore = async (storeID) => {
    await APIKit.get(URLS.deleteStore + "/" + storeID).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        getStore();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message.slice(21), {
          variant,
          anchorOrigin,
        });
      }
    });
  };
  const [isLoading, setIsLoading] = useState(false);

  const getStore = async (data = "") => {
    setIsLoading(true);
    await APIKit.post(URLS.getStore, { searchText: data }).then((res) => {
      if (res.data.status === 200) {
        setStoreData(res.data.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  return (
    <Grid spacing={3} m={3}>
      <Loader isLoading={isLoading} />
      <Grid item sm={11} md={11}>
        <Box
          sx={{
            p: "0px 0px 20px",
            display: matches && "flex",
            justifyContent: "space-between",
          }}
        >
          <TextField
            autoComplete="off"
            sx={{ mt: 2, width: matches ? 300 : 200 }}
            id="outlined-basic"
            label=" Store"
            name="storeName"
            value={payload.storeName}
            variant="outlined"
            onChange={(e) => {
              setPayload({
                ...payload,
                storeName: e.target.value,
              });
            }}
          />

          <Stack spacing={2} direction={matches ? "row" : "column"}>
            {isEdit ? (
              <Box sx={{ mt: 2 }}>
                <Button
                  sx={{ height: 50 }}
                  onClick={updateStore}
                  variant="contained"
                  disabled={!payload.storeName}
                >
                  Update Store
                </Button>{" "}
                <Button
                  sx={{ height: 50 }}
                  onClick={() => {
                    setIsEdit(false);
                    setPayload({ storeName: "" });
                  }}
                  variant="contained"
                >
                  Cancel
                </Button>{" "}
              </Box>
            ) : (
              <Button
                sx={{ height: 50, mt: 2 }}
                onClick={createStore}
                variant="contained"
                disabled={!payload.storeName}
              >
                Add Store
              </Button>
            )}
          </Stack>
        </Box>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            width: matches ? 300 : 200,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            onChange={(e) => {
              getStore(e.target.value);
            }}
            inputProps={{ "aria-label": "search google maps" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <CommonTable columns={storeColumn} data={storeData} action={actions} />
      </Grid>
    </Grid>
  );
}

export default Store;
