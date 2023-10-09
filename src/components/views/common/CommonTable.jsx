import { Icon } from "@iconify/react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import PaymentIcon from "@mui/icons-material/Payment";
import PhoneIcon from '@mui/icons-material/Phone';
import ShopIcon from "@mui/icons-material/Shop";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Table, TableBody,
  TableCell, tableCellClasses, TableContainer, TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React from "react";
import { EEditable, ETaction, ETTypes } from "./Types";
import { dateFormate } from "./utilities";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
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

const CommonTable = ({ columns, data = [], action }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const render = (head, row, index) => {
    if (head.field === "Action" || head.field === "action") {
      let onView = head.list.find((x) => x === ETaction.onView);
      let onDelete = head.list.find((x) => x === ETaction.onDelete);
      let trackApprove = head.list.find((x) => x === ETaction.trackApprove);
      let onEdit = head.list.find((x) => x === ETaction.onEdit);
      let onPrint = head.list.find((x) => x === ETaction.onPrint);
      let onPayment = head.list.find((x) => x === ETaction.onPayment);
      let moveOnPurchase = head.list.find((x) => x === ETaction.moveOnPurchase);
      let onCall = head.list.find((x) => x === ETaction.onCall);
      let onWP = head.list.find((x) => x === ETaction.onWP);
      let onOff = head.list.find((x) => x === ETaction.onOff);
      return (
        <>
          {onView && (
            <VisibilityIcon
              style={{ margin: "5px", cursor: "pointer" }}
              onClick={(e) => {
                if (action && action.onView) {
                  action.onView(index, row);
                }
              }}
            />
          )}
          {onOff && (
             <FormControlLabel
             control={<IOSSwitch checked={row.isActive === 0 ? true : false}
              onChange={(e) => {
                console.log(e.target.value);
                if (action && action.onOff) {
                  action.onOff(index, row);
                }
              }} />}
             
           />
          )}
          {onCall && (
            <a href={"tel:" + row.mobileNo}>
            <PhoneIcon size="19" className="nav-linker"/>
           </a>
          )}
          {onWP && (
            <a target={"_blank"} rel="noopener noreferrer" href={"https://api.whatsapp.com/send?phone=" + row.mobileNo}>
            <WhatsAppIcon size="19" className="nav-linker"/>
           </a>
          )}
          {onEdit && (
            <EditIcon
              style={{ margin: "5px", cursor: "pointer" }}
              onClick={(e) => {
                if (action && action.onEdit) {
                  action.onEdit(index, row);
                }
              }}
            />
          )}
          {trackApprove && (
            <Icon
              icon="wpf:approval"
              style={{
                marginLeft: "24px",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={(e) => {
                if (action && action.trackApprove) {
                  action.trackApprove(index, row);
                }
              }}
            />
          )}
          {onDelete && (
            <DeleteOutlineIcon
              style={{ margin: "5px", cursor: "pointer" }}
              onClick={(e) => {
                if (action && action.onDelete) {
                  action.onDelete(index, row);
                }
              }}
            />
          )}
          {onPrint && (
            <LocalPrintshopIcon
              style={{ margin: "5px", cursor: "pointer" }}
              onClick={(e) => {
                if (action && action.onPrint) {
                  action.onPrint(index, row);
                }
              }}
            />
             
           
          )}
          {onPayment && (
            <PaymentIcon
              style={{ margin: "5px", cursor: "pointer" }}
              onClick={(e) => {
                if (action && action.onPayment) {
                  action.onPayment(index, row);
                }
              }}
            />
          )}
          {moveOnPurchase && (
            <ShopIcon
              style={{
                marginLeft: "43px",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={(e) => {
                if (action && action.moveOnPurchase) {
                  action.moveOnPurchase(index, row);
                }
              }}
            />
          )}
        </>
      );
    } else if (head.editable && head.editable === EEditable.onEdit) {
      return (
        <TextField
          fullWidth
          helperText={head.helperText || ""}
          label={head.title}
          name={head.title}
          onChange={(e) => {
            if (action && action.editRow) {
              if (head.type === ETTypes.numeric) {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  action.editRow(
                    index,
                    head.field,
                    e.target.value ? Number(e.target.value) : 0
                  );
                }
              } else {
                action.editRow(index, head.field, e.target.value);
              }
            }
          }}
          required
          value={row[head.field]}
          variant="outlined"
        />
      );
    } else {
      if (head.type === ETTypes.string) {
        return row[head.field] === undefined
          ? ""
          : row[head.field]
          ? row[head.field]
          : "-";
      } else if (head.type === ETTypes.numeric) {
        return row[head.field];
      } else if (head.type === ETTypes.currency) {
        return Number(row[head.field]).toLocaleString("en-IN");
      } else if (head.type === ETTypes.date) {
        return row[head.field] ? dateFormate(row[head.field]) : "";
      } else if (head.type === ETTypes.link) {
        return row[head.field] !== "undefined" &&
          row[head.field] !== "null" &&
          row[head.field] !== "" ? (
          <a
            style={{ color: "blue", cursor: "pointer" }}
            href={row[head.field]}
          >
            {row[head.field].substring(4, 25)}
          </a>
        ) : (
          "-"
        );
      } else if (head.type === ETTypes.boolean) {
        return row[head.field] ? "Yes" : "No";
      } else if (head.type === ETTypes.SNo) {
        return (row[head.field] = page * 10 + index + 1);
      }
    }
  };

  return (
    <>
      {" "}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((head, index) => (
                <StyledTableCell
                  key={index}
                  align={head.align ? head.align : "right"}
                >
                  {head.title}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {data.map((row, i) => <TableRow hover role="checkbox" key={i + 1}> */}
            {data.length !== 0 && data ? (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <StyledTableRow hover role="checkbox" key={i + 1}>
                    {columns.map((head) => (
                      <StyledTableCell
                        key={i + head.field}
                        align={head.align ? head.align : "right"}
                      >
                        {render(head, row, i)}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))
            ) : (
              <StyledTableRow hover role="checkbox" key={1}>
                <StyledTableCell
                  colSpan={columns.length}
                  align="center"
                  key={2}
                >
                  {"No Data Found"}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data ? data.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default CommonTable;
