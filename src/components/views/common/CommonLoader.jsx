import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.primary.main,
    minHeight: "100%",
    paddingBottom: 3,
    paddingTop: 3,
    fontFamily: "Arial",
  },
  backdrop: {
    zIndex: 1,
    color: "#3f51b5",
  },
}));

export default function Loader({ isLoading }) {
  const classes = useStyles();

  return (
    <div>
      <Backdrop
        sx={{ color: "#3f51b5", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        className={classes.backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
