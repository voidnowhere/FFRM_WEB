import {configureStore} from '@reduxjs/toolkit'
import {userReducer} from "./features/user/userSlice.js";

export default configureStore({
    reducer: {
        user: userReducer,
    },
});