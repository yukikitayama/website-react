import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ConstructionIcon from "@mui/icons-material/Construction";
import WarningIcon from "@mui/icons-material/Warning";
import AccessibiltyNewIcon from "@mui/icons-material/AccessibilityNew";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Auth as AwsAuth } from "aws-amplify";
// import ResponsiveEmbed from "react-responsive-embed";

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
        pt={2}
        pb={10}
      >
        {/* <Grid item xs={12}>
          <ResponsiveEmbed src="https://docs.google.com/presentation/d/e/2PACX-1vSlRNFJdKh4c4586Ohh68tiXleeYzq7o-HYOgUFwW5YkzI9mtI1bPlpcwZBkKbqj_6bgTmpaIKdg9Eb/embed" allowFullScreen />
        </Grid> */}
        <Grid item xs={12} md={6} >
          <DashboardCard
            title={"Todo"}
            subheader={"Things that I need to take action"}
            icon={<ConstructionIcon fontSize="large" color="primary" />}
            content={
              <ul>
                <li>Develop API method to update or delete the existing expense</li>
                <li>Add animation to tabulate posts in skill component</li>
                <li>Supress blue color of HTML a link tag</li>
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
            subheader={"Checking login status and authorization to modify data"}
            icon={<VpnKeyIcon fontSize="large" color="primary" />}
            content={
              <Fragment>
                <ul>
                  <li>Cannot submit API requests to modify expense data unless logged in</li>
                  <li>API Gateway method to update expense data cannot be used without ID token which you can get from Amazon Cognito login</li>
                </ul>
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
