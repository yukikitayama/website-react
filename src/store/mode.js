import { createSlice } from '@reduxjs/toolkit';

const initialModeState = { mode: "light" };

const modeSlice = createSlice({
  name: "mode",
  initialState: initialModeState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const modeActions = modeSlice.actions;

export default modeSlice.reducer;