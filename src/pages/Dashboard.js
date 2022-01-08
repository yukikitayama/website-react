import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Auth as AwsAuth } from "aws-amplify";

import { authActions } from '../store/auth-slice';

const Dashboard = () => {
  const mode = useSelector((state) => state.mode.mode);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const getAuthenticatedStatus = async () => {
    const response = await AwsAuth.currentAuthenticatedUser();
    console.log(response);

    const session = await AwsAuth.currentSession();
    console.log(session);
  };

  const logoutHandler = async () => {
    try {
      await AwsAuth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      dispatch(authActions.logout());
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  return (
    <Fragment>
      <p>Action</p>
      <ul>
        <li>Show the fetched single expense data to component</li>
        <li>Allow to modify the item in the Expense table</li>
        <li>Allow to delete the item in the Expense table</li>
        <li>Separate sidebar code from Navigation component</li>
        <li>Connect Redux route state to Tabs state value</li>
      </ul>
      
      <p>Issue</p>
      <ul>
        <li>When decrease screen width and header tabs disappear, the error "MUI: The `value` provided to the Tabs component is invalid." appears in console</li>
        <li>When remove mode variable in local storage, app initialization fail.
          <ul>
            <li>Solved. This was because ThemeToggle.js uses localStorage.getItem() to get the mode variable from browser storage to persist the light/dark mode, but at the very first time browser doesn't have the variable, so if null, set default light to mode.</li>
          </ul>
        </li>
      </ul>
      
      <p>Mode</p>
      <ul>
        <li>{mode} mode from Redux</li>
      </ul>

      <p>Authentication</p>
      {!isAuth && <Button variant="contained" component={Link} to={"/login"}>To Login Page</Button>}
      {isAuth && <Button variant="contained" onClick={logoutHandler} color="warning">Logout</Button>}
      {isAuth && <Button variant="contained" onClick={getAuthenticatedStatus}>Get current authentication</Button>}

      <p>Screen size</p>
      <p>Display when screen is wide</p>
      <Box
        sx={{
          display: { xs: "none", md: "inline" },
          m: 2,
          p: 2,
          bgcolor: "info.main",
          borderRadius: 2,
        }}
      >
        Wide screen
      </Box>
      <p>Display when screen is narrow</p>
      <Box
        sx={{
          display: { xs: "inline", md: "none" },
          m: 2,
          p: 2,
          bgcolor: "success.main",
          borderRadius: 2,
        }}
      >
        Narrow screen
      </Box>
    </Fragment>
  );
};

export default Dashboard;
