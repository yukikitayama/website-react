import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const list = (
    <Box
      sx={{ width: 200 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Skill", "Money", "Health"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
            value="dashboard"
            // textColor="inherit"
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ display: { xs: "none", md: "block" }, pt: 1, pl: 2 }}
          >
            <Tab value="dashboard" label="Dashboard" />
            <Tab value="skill" label="Skill" />
            <Tab value="expense" label="Expense" />
            <Tab value="fitness" label="Fitness" />
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
