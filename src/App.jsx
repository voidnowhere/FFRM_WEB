import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Register from './components/Register.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProfileInformation from "./components/ProfileInformation.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx";
import {useSelector} from "react-redux";

export default function App() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={(isAuthenticated) ? <Navigate to="/"/> : <Login/>}/>
                <Route path="/register" element={(isAuthenticated) ? <Navigate to="/"/> : <Register/>}/>
                <Route path="/profile" element={(!isAuthenticated) ? <Navigate to="/login"/> : <ProfileInformation/>}/>
                <Route path="/update-password"
                       element={(!isAuthenticated) ? <Navigate to="/login"/> : <UpdatePassword/>}/>
            </Routes>
        </BrowserRouter>
    )
}
