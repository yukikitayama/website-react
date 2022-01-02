import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Auth as AwsAuth } from "aws-amplify";

// import Auth from '../store/auth';
import Auth from "../components/Auth";
import AuthContext from "../store/auth-context";

const Dashboard = () => {
  const mode = useSelector((state) => state.mode.mode);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const getAuthenticatedStatus = async () => {
    const response = await AwsAuth.currentAuthenticatedUser();
    console.log(response);

    const session = await AwsAuth.currentSession();
    console.log(session);
  };

  const consoleIdToken = () => {
    console.log(authCtx.token);
  };

  const signOut = async () => {
    try {
      await AwsAuth.signOut();
      authCtx.logout();
      console.log('signout success');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <Fragment>
      <p>Action</p>
      <ul>
        <li>Convert React Context API to Redux by Udemy Section 18</li>
        <li>Enable app wide Amplify authenticated status</li>
        <li>Show the fetched single expense data to component</li>
        <li>Allow to modify the item in the Expense table</li>
        <li>Allow to delete the item in the Expense table</li>
        <li>Separate sidebar code from Navigation component</li>
        <li>Connect Redux route state to Tabs state value</li>
      </ul>
      <p>Issue</p>
      <ul>
        <li>When remove mode variable in local storage, app initialization fail.
          <ul>
            <li>Solved. This was because ThemeToggle.js uses localStorage.getItem() to get the mode variable from browser storage to persist the light/dark mode, but at the very first time browser doesn't have the variable, so if null, set default light to mode.</li>
          </ul>
        </li>
      </ul>
      <p>{mode} mode from Redux</p>
      <Auth />
      {isAuth && <p>Authenticated status: Logged in</p>}
      {!isAuth && <p>Authenticated status: Logged out</p>}
      {!isLoggedIn && <Button variant="contained" component={Link} to={"/login"}>
        To Login Page
      </Button>}
      {isLoggedIn && <Button onClick={getAuthenticatedStatus}>Get current authentication</Button>}
      {isLoggedIn && <Button onClick={consoleIdToken}>Console ID Token</Button>}
      {isLoggedIn && <Button onClick={signOut} color="warning">Signout</Button>}
      {isLoggedIn && <Button onClick={logoutHandler} color="warning">Logout</Button>}

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
