import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ConstructionIcon from "@mui/icons-material/Construction";
import WarningIcon from "@mui/icons-material/Warning";
import AccessibiltyNewIcon from "@mui/icons-material/AccessibilityNew";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Auth as AwsAuth } from "aws-amplify";

import DashboardCard from "../components/DashboardCard";
import { authActions } from "../store/auth-slice";

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
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      dispatch(authActions.logout());
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        spacing={2}
        rowSpacing={2}
        justifyContent="center"
        p={2}
        pb={10}
      >
        <Grid item xs={12} md={6} >
          <DashboardCard
            title={"Todo"}
            subheader={"Things that I need to take action"}
            icon={<ConstructionIcon fontSize="large" color="primary" />}
            content={
              <ul>
                <li>Link components to the side bar menu, otherwise won't work in mobile</li>
                <li>Separate sidebar code from Navigation component</li>
                <li>Connect Redux route state to Tabs state value</li>
              </ul>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard
            title={"Issue"}
            subheader={
              "Weird or inconvenient things happening in this website and I need to fix"
            }
            icon={<WarningIcon fontSize="large" color="primary" />}
            content={
              <ul>
                <li>
                  When decrease screen width and header tabs disappear, the
                  error "MUI: The `value` provided to the Tabs component is
                  invalid." appears in console
                </li>
                <li>
                  When remove mode variable in local storage, app initialization
                  fail.
                  <ul>
                    <li>
                      Solved. This was because ThemeToggle.js uses
                      localStorage.getItem() to get the mode variable from
                      browser storage to persist the light/dark mode, but at the
                      very first time browser doesn't have the variable, so if
                      null, set default light to mode.
                    </li>
                  </ul>
                </li>
              </ul>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard
            title={"Test"}
            subheader={
              "Playground section where I am testing developing React components"
            }
            icon={<AccessibiltyNewIcon fontSize="large" color="primary" />}
            content={
              <ul>
                <li>
                  Mode
                  <ul>
                    <li>{mode} mode from Redux</li>
                  </ul>
                </li>
              </ul>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard
            title={"Authentication"}
            subheader={"Checking login status"}
            icon={<VpnKeyIcon fontSize="large" color="primary" />}
            content={
              <Fragment>
                {isAuth && (
                  <Button
                    variant="contained"
                    onClick={logoutHandler}
                    color="warning"
                  >
                    Logout
                  </Button>
                )}
                {isAuth && (
                  <Button variant="contained" onClick={getAuthenticatedStatus}>
                    Get current authentication
                  </Button>
                )}
              </Fragment>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Dashboard;
