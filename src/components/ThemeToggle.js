import { Fragment } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Switch from "@mui/material/Switch";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { modeActions } from '../store/mode';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.mode.mode);

  // Persist mode for reload
  const savedMode = localStorage.getItem('mode');
  dispatch(modeActions.initializeMode(savedMode));
  
  const toggleModeHandler = () => {
    const savedMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('mode', savedMode);
    dispatch(modeActions.toggleMode());
  };

  return (
    <Fragment>
      <Brightness7Icon />
      <Switch checked={savedMode === 'dark'} onChange={toggleModeHandler} color="secondary" />
      <Brightness4Icon />
      {/* <p>{mode} mode</p> */}
    </Fragment>
  );
};

export default ThemeToggle;
