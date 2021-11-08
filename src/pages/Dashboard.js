import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Auth as AwsAuth } from "aws-amplify";

// import Auth from '../store/auth';
import Auth from "../components/Auth";

const Dashboard = () => {
  const mode = useSelector((state) => state.mode.mode);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const getAuthenticatedStatus = async () => {
    const response = await AwsAuth.currentAuthenticatedUser();
    console.log(response);

    const session = await AwsAuth.currentSession();
    console.log(session);
  };

  const signOut = async () => {
    try {
      await AwsAuth.signOut();
      console.log('signout success');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  return (
    <Fragment>
      <ul>
        <li>Enable app wide Amplify authenticated status</li>
        <li>Show the fetched single expense data to component</li>
        <li>Allow to modify the item in the Expense table</li>
        <li>Allow to delete the item in the Expense table</li>
        <li>Separate sidebar code from Navigation component</li>
        <li>Connect Redux route state to Tabs state value</li>
      </ul>
      <p>{mode} mode from Redux</p>
      <Auth />
      {isAuth && <p>Authenticated status: Logged in</p>}
      {!isAuth && <p>Authenticated status: Logged out</p>}
      <Button variant="contained" component={Link} to={"/login"}>
        To Login Page
      </Button>
      <Button onClick={getAuthenticatedStatus}>Get current authentication</Button>
      <Button onClick={signOut} color="warning">Signout</Button>

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
