import { configureStore } from "@reduxjs/toolkit";

import modeReducer from './mode-slice';
import authReducer from './auth-slice';


const store = configureStore({
  reducer: { mode: modeReducer, auth: authReducer },
});

export default store;
