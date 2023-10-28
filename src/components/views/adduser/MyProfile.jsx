import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { URLS } from "../../utilities/URLS";
import APIKit from "../../utilities/APIKIT";
import Select from "react-select";
import { useSnackbar } from "notistack";
import { MESSAGE } from "../../utilities/constant";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

function MyProfile(props) {
  let state = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 45,
      minHeight: 55,
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: isFocused
        ? "hsla(#0000ff, 64%, 42%, 0.5)"
        : isSelected
        ? "hsla(#0000ff, 64%, 42%, 1)"
        : undefined,
      zIndex: 1,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const initialValues = {
    companyName: "",
    address: "",
    state: "",
    mobileNumber: "",
    email: "",
    gst: "",
    bankName: "",
    accHolderName: "",
    accNumber: "",
    accType: "",
    ifscCode: "",
    branch: "",
    // orderMinAmount: ""
    isFirst: true,
    imagePath: ""
  };
  const [payload, setPayload] = useState({ ...initialValues });
  const [pass, setPass] = useState({
    currentPassword: "",
    newPassword: "",
    reTypeNewPassword: "",
  });
  useEffect(() => {
    getCompanyDetails();
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const saveProfile = async () => {
    delete payload.companyID;
    delete payload.storeID;
    await APIKit.post(URLS.addCompanyDetails, payload).then((res) => {
      if (res.data.status === 200) {
        getCompanyDetails();
        variant = "success";
        enqueueSnackbar(MESSAGE.profile, { variant, anchorOrigin });
      } else {
      }
    });
  };
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const updatePassword = async () => {
    if (userData.pass !== pass.currentPassword) {
      variant = "error";
      enqueueSnackbar("Current Password is wrong", { variant, anchorOrigin });
      return;
    } else if (pass.newPassword !== pass.reTypeNewPassword) {
      variant = "error";
      enqueueSnackbar("Password do not match", { variant, anchorOrigin });
      return;
    } else {
      await APIKit.post(URLS.updatePassword, {
        password: pass.newPassword,
      }).then((res) => {
        if (res.data.status === 200) {
          setPass({
            currentPassword: "",
            newPassword: "",
            reTypeNewPassword: "",
          });
          variant = "success";
          enqueueSnackbar(MESSAGE.pass, { variant, anchorOrigin });
        } else {
        }
      });
    }
  };
  const getCompanyDetails = async () => {
    await APIKit.get(URLS.getCompanyDetails).then((res) => {
      if (res.data.status === 200) {
        setPayload(res.data.data);
        if (Object.keys(res.data.data).length === 0) {
          setPayload({
            ...payload,
            isFirst: true,
          });
        } else {
          setPayload({
            ...res.data.data,
            isFirst: false,
          });
        }
      } else {
      }
    });
  };
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [file, setFile] = useState("");
  const isFileAllowed = (fileName) => {
    let _isFileAllowed = false;
    let allowedFiles = [];

    allowedFiles = [".jpeg", ".jpg", ".png" , ".PNG", ".JPG", ".JPEG"];

    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of allowedFiles) {
        if (ext === extension[0]) {
          _isFileAllowed = true;
        }
      }
    }
    return _isFileAllowed;
  };
  const handleUploadClick = async (event) => {
    if (event.target.files[0] === undefined) {
      return;
    }
    if (!isFileAllowed(event.target.files[0]?.name)) {
      variant = "error";
      enqueueSnackbar("File Format not allowed", { variant, anchorOrigin });
      return;
    }
    if (event.target.files[0].size > 3145728) {
      variant = "error";
      enqueueSnackbar("File size more than 3mb", { variant, anchorOrigin });
      return;
    }
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    const data = new FormData();
    data.append("file", event.target.files[0]);
    console.log(Object.fromEntries(data));
    APIKit.postImg(URLS.uploadAvatar, data)
      .then((res) => {
        if (res.data.status == 200) {
          var replaceableString = String.raw`${res.data.data}`.replace(/\\/g,"\\\\");
          console.log(replaceableString);
          setPayload({
            ...payload,
            imagePath: replaceableString
          })
          variant = "success";
          enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        } else {
        }
      })
      .catch(() => {});
  };
  return (
    <div>
      <Grid spacing={3}>
        <Grid item sm={12} md={12}>
          <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2, mb: 4 }}>
            <Box
              sx={{
                p: 4,
              }}
            >
              <Grid container spacing={4}>
                <Grid item md={3} sm={12}>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={pass.currentPassword}
                      inputProps={{
                        autocomplete: "new-password",
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      onChange={(e) => {
                        setPass({
                          ...pass,
                          currentPassword: e.target.value,
                        });
                      }}
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Current Password"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="New Password"
                    value={pass.newPassword}
                    name="newPassword"
                    onChange={(e) => {
                      setPass({
                        ...pass,
                        newPassword: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Retype New Password"
                    name="retypeNewPassword"
                    value={pass.reTypeNewPassword}
                    onChange={(e) => {
                      setPass({
                        ...pass,
                        reTypeNewPassword: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <Button
                    onClick={updatePassword}
                    sx={{ height: 50 }}
                    variant="contained"
                    disabled={
                      !pass.currentPassword ||
                      !pass.newPassword ||
                      !pass.reTypeNewPassword
                    }
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
          {/* <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2, mb: 4 }}>
            <Box
              sx={{
                p: 4,
              }}
            >
              <Grid container spacing={4}>
                <Grid item md={3} sm={12}>
                  <Button variant="contained" component="label">
                    Upload File
                    <input type="file" hidden />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card> */}

          <Card sx={{ borderRadius: 3, mt: 2, mr: 2, ml: 2, mb: 4 }}>
            <Box
              sx={{
                p: 4,
              }}
            >
              <Grid container spacing={4}>
                <Grid item md={3} sm={12}>
                  <Button variant="contained" component="label">
                    Upload File
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleUploadClick(e)}
                    />
                  </Button>
                  {payload.imagePath && (
                    <a href={payload.imagePath} target="_blank">{payload.imagePath.substring(4, 25)}</a>
                  )}
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Company Name"
                    name="companyName"
                    value={payload.companyName}
                    autoFocus
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        companyName: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Address"
                    name="address"
                    value={payload.address}
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        address: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <Select
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    placeholder={"Search State"}
                    value={payload.state !== "" ? null : payload.state}
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        state: e.value,
                      });
                    }}
                    options={state.map((e) => {
                      return {
                        value: e,
                        label: e,
                      };
                    })}
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Mobile Number"
                    value={payload.mobileNumber}
                    name="mobileNumber"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        mobileNumber: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    value={payload.email}
                    label="Email"
                    name="email"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        email: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="GST"
                    value={payload.gst}
                    name="gst"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        gst: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Bank Name"
                    value={payload.bankName}
                    name="bankName"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        bankName: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Account Holder Name"
                    value={payload.accHolderName}
                    name="accHolderName"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        accHolderName: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    value={payload.accNumber}
                    label="Account Number"
                    name="accNumber"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        accNumber: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Account Type"
                    value={payload.accType}
                    name="accType"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        accType: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="IFSC Code"
                    value={payload.ifscCode}
                    name="ifscCode"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        ifscCode: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Branch"
                    value={payload.branch}
                    name="branch"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        branch: e.target.value,
                      });
                    }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                {/* <Grid item md={3} sm={12}>
                  <TextField
                    id="outlined-basic"
                    label="Order Minimum Amount"
                    name="orderMinAmount"
                    onChange={(e) => {
                      
                    }}
                    
                    fullWidth
                    variant="outlined"
                  />
                </Grid> */}
                <Grid item md={3} sm={12}>
                  <Button
                    onClick={saveProfile}
                    sx={{ height: 50 }}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default MyProfile;
