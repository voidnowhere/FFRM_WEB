import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Register from './components/Register.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProfileInformation from "./components/ProfileInformation.jsx";
import {createContext, useState} from "react";
import UpdatePassword from "./components/UpdatePassword.jsx";
import ListFieldTypeById from "./components/ListFieldTypeById.jsx";

export const AppContext = createContext();

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    return (
        <AppContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/api/fieldType/:id" element={<ListFieldTypeById/>}/>
                    <Route path="/login" element={(isAuthenticated) ? <Navigate to="/"/> : <Login/>}/>
                    <Route path="/register" element={(isAuthenticated) ? <Navigate to="/"/> : <Register/>}/>
                    <Route path="/profile" element={(!isAuthenticated) ? <Navigate to="/login"/> : <ProfileInformation/>}/>
                    <Route path="/update-password"
                           element={(!isAuthenticated) ? <Navigate to="/login"/> : <UpdatePassword/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    )
}
