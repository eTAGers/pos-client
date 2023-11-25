import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";

const MyAutoComplete = styled(Autocomplete)`
  .MuiAutocomplete-popper {
    z-index: 9999999;
  }
`;

export const AutoComplete = (props) => {
  return (
    <>
      <MyAutoComplete
        disablePortal
        id="combo-box-demo"
        options={props.options}
        onChange={props.onChange}
        noOptionsText={props.noOptionsText}
        sx={{ width: 300 }}
        // value={props.value}
        renderInput={(params) => (
          <TextField
            {...params}
            name={props.name}
            error={props.error}
            onBlur={props.onBlur}
            label={props.label}
            value={props.value ?? ""}
            helperText={props.helperText}
          />
        )}
      />
    </>
  );
};
