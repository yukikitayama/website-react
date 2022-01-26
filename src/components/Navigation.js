import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const history = useHistory();
  // Side menu
  const [state, setState] = useState(false);
  // Tabs menu
  const path = window.location.pathname;
  let tabValue = 0;
  if (path.includes("dashboard")) {
    tabValue = 0;
  } else if (path.includes("skill")) {
    tabValue = 1;
  } else if (path.includes("expense")) {
    tabValue = 2;
  } else if (path.includes("fitness")) {
    tabValue = 3;
  } else if (path.includes("login")) {
    tabValue = 4;
  }
  const [value, setValue] = useState(tabValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const drawerHandler = (event) => {
    const page = event.target.textContent;
    history.push(`/${page.toLowerCase()}`);
  };

  const list = (
    <Box
      sx={{ width: 200 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Dashboard", "Skill", "Expense", "Fitness", "Login"].map(
          (text, index) => (
            <ListItem disablePadding key={text}>
              <ListItemButton onClick={(event) => drawerHandler(event)}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          onClick={toggleDrawer(true)}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="div">
            Yuki Kitayama
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            // textColor="inherit"
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ display: { xs: "none", md: "block" }, pt: 1, pl: 2 }}
          >
            <Tab label="Dashboard" component={Link} to={"/dashboard"} />
            <Tab label="Skill" component={Link} to={"/skill"} />
            <Tab label="Expense" component={Link} to={"/expense"} />
            <Tab label="Fitness" component={Link} to={"/fitness"} />
            <Tab label="Login" component={Link} to={"/login"} />
          </Tabs>
        </Box>
        <ThemeToggle />
        <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
          {list}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
