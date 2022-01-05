/*
authSlice needs to have
token: ''
isLoggedIn: false
login: (token) => {},
logout: () => {}
*/
import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = { 
  isAuthenticated: false,
  token: '',
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      // redux toolkit save argument of dispatch as payload
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('expirationTime', action.payload.expirationTime);
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;