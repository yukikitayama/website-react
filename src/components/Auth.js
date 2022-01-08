import { Fragment } from "react";
import { useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { authActions } from "../store/auth-slice";

const Auth = () => {
  const dispatch = useDispatch();

  const loginHandler = () => {
    const token = 'abc';
    const expirationTime = '123';
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);
    dispatch(authActions.login({token: token, expirationTime: expirationTime}));
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
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
