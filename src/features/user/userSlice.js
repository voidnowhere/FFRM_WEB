import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: localStorage.getItem('access_token') !== null,
        isPlayer: localStorage.getItem('user_type') === 'P',
        isOwner: localStorage.getItem('user_type') === 'O',
    },
    reducers: {
        userLogin: state => {
            state.isAuthenticated = localStorage.getItem('access_token') !== null;
            state.isPlayer = localStorage.getItem('user_type') === 'P';
            state.isOwner = localStorage.getItem('user_type') === 'O';
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