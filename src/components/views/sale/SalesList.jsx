import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNavigationData } from "../../Redux/Common/action";
import APIKit from "../../utilities/APIKIT";
import { URLS } from "../../utilities/URLS";
import CommonTable from "../common/CommonTable";
import { ETaction, ETTypes } from "../common/Types";
import { useReactToPrint } from 'react-to-print';
import CommonPrint from "../common/CommonPrint";

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

function SalesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      list: [ETaction.onView,ETaction.onEdit, ETaction.onDelete,ETaction.onPrint],
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
    getSales();
  }, []);
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const handleCloseDialogue = () => setOpenDialogue(false);
  const [content, setContent] = React.useState({});

  const actions = {
    onView: (index, row) => {
      setOpenDialogue(true);
      setSalesProductsData(row.salesProducts);
    },

    onEdit: async (index, row) => {
      await dispatch(getNavigationData(row));
      navigate("/app/salesNew/", { replace: true });
    },
    onDelete: (index, row) => {
      console.log("delete:", index, row);
      remove(row.salesMasterID, index);
    },
    onPrint: (index, row) => {
      print(row)
      setContent(row)
    }
  };
 
  const print = async (data) => {
  //   const oldPage = document.body.innerHTML;
    const html = `
      <html>
  <head>
  <title>ESTIMATE</title>
  <style>
  @media print {
      @page {
          margin-top: 0; 
          margin-bottom: 0; 
          margin-left:20px;
          margin-right:20px;
      }
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
  }
  </style>
  </head>
  <body style="width: 793px; height:283mm; border: 1px solid black; margin-top:20px; font-family: 'Roboto', sans-serif;">
      <div style="display: flex; width: 100%; padding-bottom:20px;">
          <div style="width:50%; padding-left:30px; padding-top:15px;">
              <div style="font-size:40px; color: #004aab;"><b>ESTIMATE </b></div> 
              <div style="font-size:14px; padding-top:5px;">3/1300/5, Parani Krishna Agencies
                  Sivakasi To Sattur Road
                  Paraipatti, Sivakasi </div>
              <div style="font-size:14px; padding-top:5px;">Mobile - 76399 47155 </div>
              <div style="font-size:14px; padding-top:5px;">Email - sivakasikarthicrackers@gmail.com </div>
          </div>
          <div style="width:50%; align-self: center; text-align:right; padding-right:30px;">
              <img src="images/logo.jpg" style="width:100px;">
          </div>
      </div>
      <div style="display: flex; width: 100%;">
          <div style="width:100%; padding:0 0px;">
              <div style="border-top: 2px solid #eaeaea;"></div>
          </div> 
      </div>
      <div style="display: flex; width:100%; font-size:14px;">
          <div style=" width:33.3%; padding:20px 40px 20px 40px;">
              <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Date: </b></div> 
              <div style="font-size:14px;">${new Date()
                .toJSON()
                .slice(0, 10)
                .replace(/-/g, "/")} </div> 
          </div>
          <div style=" width:33.3%; padding:20px 40px 20px 40px;">
              <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Estimate No: </b></div> 
              <div style="font-size:14px;">ES 202301</div>
          </div>
          <div style=" width:33.3%; padding:20px 40px 20px 40px; text-align: right;">
              <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Estimate To: </b></div> 
              <div style="font-size:14px;">${data.customerName} </div>
              <div style="font-size:14px;">${data.customerMobile} </div>
              <div style="font-size:14px;">${data.customerCity} </div>
          </div>
      </div>
      <div style="padding:0 0px;">
          <table style="border-collapse: collapse; width:100%; padding:40px 50px 10px 50px;" class="clr">
              <tr style="font-size:13px; background-color: #004aab; color:#fff;">
                  <th style="width:60px; padding: 15px 15px; text-align: center;">S.NO</th>
                  <th style="width:60px; padding: 15px 15px; text-align: center;">Product Name</th>
                  <th style="width:100px; padding: 15px 15px; text-align: center;">Product Qty</th>
                  <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost Per Unit</th>
                  <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost</th>
              </tr> 
              ${data.salesProducts.map((e, i) => {
                return `
                <tr style="font-size:14px; background:#fff; border-bottom:1px solid #ababab; color: #9d9d9d; padding:5px;">
                <td style="width:60px;  padding:5px; text-align: center;">${
                  i + 1
                } </td>
                <td style="width:60px; padding:5px; text-align: center;">${
                  e.productName
                }</td>
                <td style="width:100px; padding:5px; text-align: center;">${
                  e.productQty
                }</td>
                <td style="width:60px; padding:5px; text-align: center;">${
                  e.productCost
                }</td>
                <td style="width:60px; padding:5px; text-align: center;">${
                  e.productCost * e.productQty
                }</td>
                </tr>
                `;
              })}
            
              
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Subtotal : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">${data.salesProducts.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  )}</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Discount : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">${
                    data.discount
                  }%</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
              <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Packing Charges (3%) : </td>
              <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">Rs.${
                data.packingCost
              }</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Total : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">Rs.${
                    data.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) -
                    data.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) *
                      (Number(data.discount) / 100) +
                    Number(data.packingCost)
                  }</td>
              </tr>
             
            
              <tr style="background:#004aab; color: #fff;">
                  <td style="width:100px; font-size:14px; padding:5px 15px; text-align: left;" colspan="2">Total Items : ${
                    data.salesProducts.length
                  }</td>
                  <td style="width:100px; font-size:14px; padding:5px 15px; text-align: right;" colspan="2">Overall Total : </td>
                  <td style="width:120px; font-size:18px; padding:5px 25px; text-align: right;" colspan="2">Rs.${
                    data.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) -
                    data.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) *
                      (Number(data.discount) / 100) +
                    Number(data.packingCost)
                  }</td>
              </tr>
          </table>
      </div>
  </body>
  </html>
  
  `;
  
  //   // document.body.innerHTML = html;
  //   // window.print();
  //   // document.body.innerHTML = oldPage;
  //   // // window.location.reload();
  //   // window.close()
var printWindow = window.open('', '', 'height=500,width=1000');
printWindow.document.write(html);
printWindow.document.close();
printWindow.print();
  };
  const remove = (data, i) => {
    confirm({ description: "you want to delete the record ?" })
      .then(() => {
        deleteSales(data);
      })
      .catch(() => console.log("Deletion cancelled."));
  };
  const getSales = async () => {
    await APIKit.get(URLS.getSales).then((res) => {
      if (res.data.status === 200) {
        res.data.data = res.data.data.map((e) => {
          return {
            ...e,
            salesProducts: JSON.parse(e.salesProducts),
          };
        });
        setSalesData(res.data.data);
      } else {
      }
    });
  };

  const deleteSales = async (salesMasterID) => {
    await APIKit.get(URLS.deleteSales + "/" + salesMasterID).then((res) => {
      if (res.data.status === 200) {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        getSales();
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
      <div>
      {/* <iframe id="ifmcontentstoprint" style="height: 0px; width: 0px; position: absolute"></iframe> */}
      </div>
    </div>
  );
}

export default SalesList;


