import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: localStorage.getItem('access_token') !== null,
        isPlayer: localStorage.getItem('user_type') === 'P',
        isOwner: localStorage.getItem('user_type') === 'O',
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