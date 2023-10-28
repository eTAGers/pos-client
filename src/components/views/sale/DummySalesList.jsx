import React from "react";
import { Grid } from "@mui/material";
import CommonTable from "../common/CommonTable";
import { ETaction, ETTypes } from "../common/Types";
import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useConfirm } from "material-ui-confirm";
import { URLS } from "../../utilities/URLS";
import APIKit from "../../utilities/APIKIT";
import { useSnackbar } from "notistack";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function DummySalesList() {
  const [salesData, setSalesData] = useState([]);
  const [salesProductsData, setSalesProductsData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  var userData = JSON.parse(sessionStorage.getItem("userData"))
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const salesColumn = [
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
    },
    {
        title: "Estimate Number",
        field: "estimateNum",
        align: "center",
        type: ETTypes.string,
      },
    {
      title: "Customer Name",
      field: "customerName",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Total No of Products",
      field: "totalNoofProducts",
      align: "center",
      type: ETTypes.string,
    },
    {
        title: "Sub Total",
        field: "subTotal",
        align: "center",
        type: ETTypes.string,
      },
    {
      title: "Discount ",
      field: "discount",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Packing Cost",
      field: "packingCost",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Total",
      field: "total",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Date ",
      field: "createdTime",
      align: "center",
      type: ETTypes.date,
    },

    {
      title: "Action",
      field: "action",
      align: "center",
      list: [ETaction.onView, ETaction.onDelete],
    },
  ];
  const salesProductsColumn = [
    {
      title: "SNo",
      align: "center",
      type: ETTypes.SNo,
    },
    {
      title: "Product Name",
      field: "productName",
      align: "center",
      type: ETTypes.string,
    },
    {
      title: "Product Quantity",
      field: "productQty",
      align: "center",
      type: ETTypes.string,
    },
    {
        title: "Product Cost",
        field: "productCost",
        align: "center",
        type: ETTypes.string,
      },
  ];

  useEffect(() => {
    getDummySales();
  }, []);
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const handleCloseDialogue = () => setOpenDialogue(false);

  const actions = {
    onView: (index, row) => {
      setOpenDialogue(true);
      setSalesProductsData(row.salesProducts);
    },

    onEdit: (index, row) => {},
    onDelete: (index, row) => {
      console.log("delete:", index, row);
      remove(row.dummySalesMasterID, index);
    },
  };
  const remove = (data, i) => {
    confirm({ description: "you want to delete the record ?" })
      .then(() => {
        deleteSales(data);
      })
      .catch(() => console.log("Deletion cancelled."));
  };
  const getDummySales = async () => {
    await APIKit.get(URLS.getDummySales).then((res) => {
      if (res.data.status === 200) {
        res.data.data = res.data.data.map((e) => {
          return {
            ...e,
            salesProducts: JSON.parse(e.salesProducts),
          };
        });
        console.log(res.data.data);
        setSalesData(res.data.data);
      } else {
      }
    });
  };

  const deleteSales = async (dummySalesMasterID) => {
    await APIKit.get(URLS.dummyDeleteSales + "/" + dummySalesMasterID).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        getDummySales();
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message.slice(21), { variant, anchorOrigin });
      }
    });
  };

  return (
    <div>
      <Grid m={3}>
        <Grid item sm={11} md={11}>
          <CommonTable
            columns={salesColumn}
            data={salesData}
            action={actions}
          />
        </Grid>
      </Grid>

      <BootstrapDialog
        onClose={handleCloseDialogue}
        aria-labelledby='customized-dialog-title'
        open={openDialogue}>
        <BootstrapDialogTitle
          id='customized-dialog-title'
          onClose={handleCloseDialogue}>
          Sales Products
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <CommonTable columns={salesProductsColumn} data={salesProductsData} />
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

export default DummySalesList;
