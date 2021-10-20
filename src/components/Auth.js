import { Fragment } from "react";
import { useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { authActions } from "../store/auth";

const Auth = () => {
  const dispatch = useDispatch();

  const loginHandler = () => {
    dispatch(authActions.login());
  };

  const logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <Fragment>
      <Stack spacing={2} direction="row">
        <Button onClick={loginHandler} variant="contained">
          Login
        </Button>
        <Button onClick={logoutHandler} variant="outlined">
          Logout
        </Button>
      </Stack>
    </Fragment>
  );
};

export default Auth;
