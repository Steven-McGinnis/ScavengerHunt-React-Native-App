import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const huntSlice = createSlice({
  name: "huntItems",
  initialState: {
    huntItems: [],
  },
  reducers: {},
});

export const {} = huntSlice.actions;
export default huntSlice.reducer;
