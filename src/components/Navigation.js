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

  // Drawer side menu state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // State to highlight one of tabs to indicate which page a user is currently at
  const path = window.location.pathname;
  let tabValue = 0;
  if (path.includes("dashboard")) {
    tabValue = 0;
  } else if (path.includes("trend")) {
    tabValue = 1;
  } else if (path.includes("skill")) {
    tabValue = 2;
  } else if (path.includes("expense")) {
    tabValue = 3;
  } else if (path.includes("fitness")) {
    tabValue = 4;
  } else if (path.includes("login")) {
    tabValue = 5;
  }
  const [value, setValue] = useState(tabValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Open drawer side menu by receiving open (True boolean)
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  // Function to route a user to a page when an item is clicked in drawer side menu
  const drawerRouteToPageHandler = (event) => {
    const page = event.target.textContent;
    history.push(`/${page.toLowerCase()}`);
  };

  // Left side drawer content when drawer is open
  const list = (
    <Box
      sx={{ width: 200 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Dashboard", "Trend", "Skill", "Expense", "Fitness", "Login"].map(
          (text, index) => (
            <ListItem disablePadding key={text}>
              <ListItemButton
                onClick={(event) => drawerRouteToPageHandler(event)}
              >
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
          <Typography variant="h5" component="div" >
            Yuki Kitayama
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            // textColor="inherit"
            textColor="secondary"
            indicatorColor="secondary"
            // variant="scrollable"
            sx={{
              visibility: { xs: "hidden", md: "visible" },
              width: { xs: 0, md: "auto" },
              height: { xs: 0, md: "auto" },
              pt: 0.5,
              pl: 1
            }}
          >
            <Tab label="Dashboard" component={Link} to={"/dashboard"} />
            <Tab label="Trend" component={Link} to={"/trend"} />
            <Tab label="Skill" component={Link} to={"/skill"} />
            <Tab label="Expense" component={Link} to={"/expense"} />
            <Tab label="Fitness" component={Link} to={"/fitness"} />
            <Tab label="Login" component={Link} to={"/login"} />
          </Tabs>
        </Box>
        <ThemeToggle />
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          {list}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
