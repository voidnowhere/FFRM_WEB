import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
        isPlayer: false,
        isOwner: false,
    },
    reducers: {
        userLogin: (state, action) => {
            state.isAuthenticated = true;
            if (action.payload.userType === 'P') {
                state.isPlayer = true;
            } else if (action.payload.userType === 'O') {
                state.isOwner = true;
            }
        },
        userLogout: state => {
            state.isAuthenticated = false;
            state.isPlayer = false;
            state.isOwner = false;
        },
    },
});

export const {
    userLogin,
    userLogout,
} = userSlice.actions;

export const userReducer = userSlice.reducer;