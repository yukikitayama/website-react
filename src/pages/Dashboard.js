import { Fragment } from "react";
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';

// import Auth from '../store/auth';

const Dashboard = () => {
  const mode = useSelector(state => state.mode.mode);
  const isAuth = useSelector(state => state.auth.isAuthenticated);

  return (
    <Fragment>
      <ul>
        <li>Separate sidebar code from Navigation component</li>
        <li>Make Expense route</li>
        <li>Activate Expense tab when a user is in Expense route</li>
        <li>Connect Redux route state to Tabs state value</li>
      </ul>
      <p>{mode} mode from Redux</p>
      {/* <Auth /> */}
      {isAuth && <p>Authenticated status: Logged in</p>}
      {!isAuth && <p>Authenticated status: Logged out</p>}

      <p>Display when screen is wide</p>
      <Box
        sx={{
          display: { xs: "none", md: "inline" },
          m: 2,
          p: 2,
          bgcolor: "info.main",
          borderRadius: 2,
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
          borderRadius: 2,
        }}
      >
        Narrow screen
      </Box>
    </Fragment>
  );
};

export default Dashboard;
