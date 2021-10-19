import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, amber } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Navigation from "./components/Navigation";
import Auth from "./components/Auth";

function App() {
  const mode = useSelector((state) => state.mode.mode);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: teal[200],
            },
            secondary: {
              main: amber[200],
            },
          }
        : {
            primary: {
              main: teal[200],
            },
            secondary: {
              main: amber[200],
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
          <ul>
            <li>Separate sidebar code from Navigation component</li>
            <li>Make Expense route</li>
            <li>Activate Expense tab when a user is in Expense route</li>
            <li>Connect Redux route state to Tabs state value</li>
          </ul>
          <p>{mode} mode from Redux</p>
          <Auth />
          {isAuth && <p>Authenticated status: Logged in</p>}
          {!isAuth && <p>Authenticated status: Logged out</p>}

          <p>Display when screen is wide</p>
          <Box
            sx={{
              display: { xs: "none", md: "inline" },
              m: 2,
              p: 2,
              bgcolor: "info.main",
              borderRadius: 2
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
              borderRadius: 2
            }}
          >
            Narrow screen
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
