import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
function Dashboard(props) {
  const matches = useMediaQuery("(max-width:600px)");

  return (
      <Grid
        container
        spacing={3}
        pl={!matches ? 5 : ""}
        mt={2}
        sx={{  justifyContent: matches ? "center" : "" }}
      >
        <Grid item sm={12} md={4}>
          <Card>
            <Box
              padding={4}
              sx={{ justifyContent: "space-between", display: "flex" }}
            >
              <Typography>
                <AddShoppingCartIcon />
              </Typography>
              <Typography>$ 62.8B</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item sm={12} md={4}>
          <Card>
            <Box
              padding={4}
              sx={{ justifyContent: "space-between", display: "flex" }}
            >
              <Typography>
                <LocalGroceryStoreIcon />
              </Typography>
              <Typography>$ 62.8B</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
  );
}

export default Dashboard;
