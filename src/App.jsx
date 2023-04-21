import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Register from './components/Register.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProfileInformation from "./components/ProfileInformation.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx";
import {useSelector} from "react-redux";
import AvailableReservations from "./components/AvailableReservations.jsx";
import TempReservations from "./components/TempReservations.jsx";
import ListFieldType from "./components/ListFieldType.jsx";
import {Analytics} from '@vercel/analytics/react';
import Reservations from "./components/Reservations.jsx";
import AddReservation from "./components/AddReservation.jsx";

export default function App() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isPlayer = useSelector(state => state.user.isPlayer);
    const isOwner = useSelector(state => state.user.isOwner);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={(isAuthenticated) ? <Navigate to="/"/> : <Login/>}/>
                    <Route path="/register" element={(isAuthenticated) ? <Navigate to="/"/> : <Register/>}/>
                    <Route path="/profile"
                           element={(!isAuthenticated) ? <Navigate to="/login"/> : <ProfileInformation/>}/>
                    <Route path="/update-password"
                           element={(!isAuthenticated) ? <Navigate to="/login"/> : <UpdatePassword/>}/>
                    <Route path="/reservations/available" element={(!isAuthenticated && !isPlayer) ?
                        <Navigate to="/"/> : <AvailableReservations/>}/>
                    <Route path="/temp-reservations" element={(!isAuthenticated && !isPlayer) ?
                        <Navigate to="/"/> : <TempReservations/>
                    }/>
                    <Route path="/filed-types" element={(!isAuthenticated && !isOwner) ?
                        <Navigate to="/"/> : <ListFieldType/>}/>
                    <Route path="/reservations" element={<Reservations/>}/>
                    <Route path="/booking" element={<AddReservation/>}/>
                </Routes>
            </BrowserRouter>
            <Analytics/>
        </>
    )
}
