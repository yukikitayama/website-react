import { Fragment } from "react";
import { useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { authActions } from "../store/auth-slice";

const Auth = () => {
  const dispatch = useDispatch();

  const loginHandler = () => {
    dispatch(authActions.login({token: 'abc', expirationTime: '123'}));
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
