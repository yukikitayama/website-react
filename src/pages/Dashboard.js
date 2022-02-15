import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ConstructionIcon from "@mui/icons-material/Construction";
import WarningIcon from "@mui/icons-material/Warning";
import AccessibiltyNewIcon from "@mui/icons-material/AccessibilityNew";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HomeIcon from "@mui/icons-material/Home";
import { Auth as AwsAuth } from "aws-amplify";

import DashboardCard from "../components/DashboardCard";
import { authActions } from "../store/auth-slice";
import ArchitecturePng from "../assets/website_react_architecture.png";

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
        <Grid item xs={12} md={6}>
          <DashboardCard
            title={"Architecture"}
            subheader={"Components to run this website"}
            icon={<HomeIcon fontSize="large" color="primary" />}
            image={ArchitecturePng}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title={"Todo"}
            subheader={"Things that I need to take action"}
            icon={<ConstructionIcon fontSize="large" color="primary" />}
            content={
              <ul>
                <li>I guess because going to individual skill page by history push with state, directly typing skill page URL doesn't work since data isn't available from backend.</li>
                <li>When a user clicks an item in Skill page to go to the individual page, send the clicked data to Redis to count up number of views for each skill page.</li>
                <li>Remove type column from expense table</li>
                <li>I want the place to show suggestion in expense item component</li>
                <li>Make table in expense a separate component</li>
                <li>
                  Develop API method to update or delete the existing expense
                </li>
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
                <li>Sometimes label of pie chart in Trend component doesn't show up.</li>
                <li>
                  When decrease screen width and header tabs disappear, the
                  error "MUI: The `value` provided to the Tabs component is
                  invalid." appears in console
                  <ul>
                    <li>Solved by using visibity css instead of display css.</li>
                  </ul>
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
                  <li>
                    Cannot submit API requests to modify expense data unless
                    logged in
                  </li>
                  <li>
                    API Gateway method to update expense data cannot be used
                    without ID token from Amazon Cognito login
                  </li>
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
