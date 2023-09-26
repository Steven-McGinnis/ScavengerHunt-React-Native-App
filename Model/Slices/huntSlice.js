import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const huntSlice = createSlice({
	name: 'huntItems',
	initialState: {
		huntItems: [],
	},
	reducers: {
		addHunt: (state, action) => {
			state.huntItems.push(action.payload);
		},
		clearHunts: (state) => {
			state.huntItems = [];
		},
	},
});

export const { addHunt, clearHunts } = huntSlice.actions;
export default huntSlice.reducer;
