import { createSlice } from '@reduxjs/toolkit';

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
        addHuntLocations: (state, action) => {
            const huntToUpdate = state.huntItems.find(
                (hunt) => hunt.huntid === action.payload.huntid
            );
            if (huntToUpdate) {
                huntToUpdate.locations = action.payload.locations;
            }
        },
        clearHuntLocations: (state, action) => {
            state.huntItems.forEach((hunt) => {
                if (hunt.huntid === action.payload.huntid) {
                    hunt.locations = [];
                }
            });
        },
        getHunt: (state, action) => {
            return state.huntItems.find(
                (hunt) => hunt.huntid === action.payload
            );
        },
    },
});

export const {
    addHunt,
    clearHunts,
    addHuntLocations,
    clearHuntLocations,
    getHunt,
} = huntSlice.actions;
export default huntSlice.reducer;
