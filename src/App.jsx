import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Register from './components/Register.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProfileInformation from "./components/ProfileInformation.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx";
import {useSelector} from "react-redux";
import AvailableReservations from "./components/AvailableReservations.jsx";
import FieldTypes from "./components/FieldTypes.jsx";
import Reservations from "./components/Reservations.jsx";
import Booking from "./components/Booking.jsx";
import Fields from './components/Field/Fields'

export default function App() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isPlayer = useSelector(state => state.user.isPlayer);
    const isOwner = useSelector(state => state.user.isOwner);

    const router = createBrowserRouter([
        {path: "/", element: <Home/>},
        {path: "/login", element: (isAuthenticated) ? <Navigate to="/"/> : <Login/>},
        {path: "/register", element: (isAuthenticated) ? <Navigate to="/"/> : <Register/>},
        {path: "/profile", element: (!isAuthenticated) ? <Navigate to="/login"/> : <ProfileInformation/>},
        {path: "/update-password", element: (!isAuthenticated) ? <Navigate to="/login"/> : <UpdatePassword/>},
        {
            path: "/reservations/available",
            element: (!isAuthenticated && !isPlayer) ? <Navigate to="/"/> : <AvailableReservations/>
        },
        {path: "/reservations", element: (!isAuthenticated && !isPlayer) ? <Navigate to="/"/> : <Reservations/>},
        {path: "/field-types", element: (!isAuthenticated && !isOwner) ? <Navigate to="/"/> : <FieldTypes/>},
        {path: "/fields", element: (!isAuthenticated && !isOwner) ? <Navigate to="/"/> : <Fields/>},
        {path: "/booking", element: (isOwner) ? <Navigate to="/"/> : <Booking/>},
    ]);

    return (
        <RouterProvider router={router}/>
    )
}
