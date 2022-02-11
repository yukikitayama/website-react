import { useEffect, useCallback } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, lime } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Skill from "./pages/Skill";
import SkillContent from './pages/SkillContent';
import Expense from "./pages/Expense";
import ExpenseNewItem from "./pages/ExpenseNewItem";
import ExpenseUpdateItem from "./pages/ExpenseUpdateItem";
import Fitness from "./pages/Fitness";
import Login from "./pages/Login";
import Trend from './pages/Trend';
import { retrieveStoredToken } from './utils/helpers';
import { authActions } from './store/auth-slice';
// import TestPage from "./pages/TestPage";

Amplify.configure(awsconfig);

function App() {
  const mode = useSelector((state) => state.mode.mode);
  const dispatch = useDispatch();

  const logoutHandler = useCallback(async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      dispatch(authActions.logout());
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }, [dispatch]);

  useEffect(() => {
    const tokenData = retrieveStoredToken();
    if (tokenData) {
      dispatch(authActions.login({token: tokenData.token}));
      setTimeout(logoutHandler, tokenData.duration);
    }
  }, [dispatch, logoutHandler]);

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: teal[200],
            },
            secondary: {
              main: lime[200],
            },
          }
        : {
            primary: {
              main: teal[200],
            },
            secondary: {
              main: lime[200],
            },
          }),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          height: "100vh",
        }}
      >
        <Container maxWidth="lg">
          <Navigation />
          <Switch>
            <Route path="/" exact>
              <Redirect to="/dashboard" />
            </Route>
            <Route path="/dashboard" exact>
              <Dashboard />
            </Route>
            <Route path="/trend" exact>
              <Trend />
            </Route>
            <Route path="/skill" exact>
              <Skill />
            </Route>
            <Route path="/skill/:id">
              <SkillContent />
            </Route>
            <Route path="/expense" exact>
              <Expense />
            </Route>
            <Route path="/expense/new-item" exact>
              <ExpenseNewItem />
            </Route>
            <Route path="/expense/update-item/:id">
              <ExpenseUpdateItem />
            </Route>
            <Route path="/fitness" excat>
              <Fitness />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="*">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
