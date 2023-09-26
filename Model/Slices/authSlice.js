import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    authToken: null,
  },
  reducers: {
    addAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    removeAuthToken: (state) => {
      state.authToken = null;
    },
  },
});

export const { addAuthToken, removeAuthToken } = authSlice.actions;
export default authSlice.reducer;
