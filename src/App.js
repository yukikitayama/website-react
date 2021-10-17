import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, amber } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';

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
            <li>Show menu is navigation bar in a wide screen</li>
            <li>But hide in menu icon in a narrow screen</li>
            <li>Separate sidebar code from Navigation component</li>
          </ul>
          <p>{mode} mode from Redux</p>
          <Auth />
          {isAuth && <p>Authenticated status: Logged in</p>}
          {!isAuth && <p>Authenticated status: Logged out</p>}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
