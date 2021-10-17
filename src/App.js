import { useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, amber } from "@mui/material/colors";

import Navigation from "./components/Navigation";
import Auth from './components/Auth';

const getDesignTokens = (mode) => ({
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

function App() {
  const tmpMode = useSelector(state => state.mode.mode);
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Navigation />
      <ul>
        <li>Add Dark mode to toggle</li>
        <li>Show menu is navigation bar in a wide screen</li>
        <li>But hide in menu icon in a narrow screen</li>
        <li>https://mui.com/customization/dark-mode/</li>
      </ul>
      <div>{theme.palette.mode} mode</div>
      <p>{tmpMode} mode from Redux</p>
      <Auth />
      {isAuth && <p>Authenticated status: Logged in</p>}
      {!isAuth && <p>Authenticated status: Logged out</p>}
    </ThemeProvider>
  );
}

export default App;
