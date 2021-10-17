import { configureStore } from "@reduxjs/toolkit";

import modeReducer from './mode';
import authReducer from './auth';


const store = configureStore({
  // reducer: modeSlice.reducer
  reducer: { mode: modeReducer, auth: authReducer },
});

export default store;
