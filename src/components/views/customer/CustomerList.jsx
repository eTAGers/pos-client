import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import APIKit from "../../utilities/APIKIT";
import { URLS } from "../../utilities/URLS";
import CommonTable from "../common/CommonTable";
import { ETaction, ETTypes } from "../common/Types";
function CustomerList(props) {
  const productColumn = [
    {
      title: "SNo",
      align: "center",
      type: ETTypes.SNo,
    },
    {
      title: "Customer Name",
      field: "name",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Customer Mobile Number",
      field: "mobileNo",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Customer City",
      field: "city",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Action",
      field: "action",
      align: "center",
      list: [ETaction.onCall, ETaction.onWP, ETaction.onDelete],
    },
  ];
  const [customer, setCustomer] = useState([]);
  const getCustomer = async () => {
    await APIKit.get(URLS.getCustomer).then((res) => {
      if (res.data.status === 200) {
        setCustomer(res.data.data);
      } else {
         if (res.data.message === "User Login from different browser. Please Login Again") {
            variant = "error";
            enqueueSnackbar("User Login from different browser. Please Login Again", { variant, anchorOrigin });
            return;
          }
      }
    });
  };
  useEffect(() => {
    getCustomer();
  }, []);
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const actions = {
    onCall: (index, row) => {},
    onDelete: (i, r) => {
      console.log("hi");
      remove(r.customerID, i);
    },
  };
  const remove = (data, i) => {
    confirm({ description: "you want to delete the record ?" })
      .then(() => {
        deleteCustomer(data);
      })
      .catch(() => console.log("Deletion cancelled."));
  };
  const deleteCustomer = async (customerID) => {
    await APIKit.get(URLS.deleteCustomer + "/" + customerID).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        getCustomer();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
      }
    });
  };

  return (
    <div>
      <Grid spacing={3} m={3}>
        <Grid item sm={11} md={11}>
          <Box
          // sx={{
          //   p: "20px",
          //   display: "flex",
          //   justifyContent: "space-between",
          // }}
          >
            <CommonTable columns={productColumn} data={customer} action={actions}/>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default CustomerList;
