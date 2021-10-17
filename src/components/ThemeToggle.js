import { Fragment } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Switch from "@mui/material/Switch";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { modeActions } from '../store/mode';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.mode.mode);

  const toggleModeHandler = () => {
    dispatch(modeActions.toggleMode());
  };

  return (
    <Fragment>
      <Brightness7Icon />
      <Switch onChange={toggleModeHandler} color="secondary" />
      <Brightness4Icon />
      <p>{mode} mode</p>
    </Fragment>
  );
};

export default ThemeToggle;
