import Header from "./Header.jsx";
import {Notify} from 'notiflix/build/notiflix-notify-aio';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.location.search.includes('session-expired')) {
            Notify.failure('Your session is expired!', {position: 'center-bottom'});
            navigate('/login');
        }
    }, []);

    return (
        <>
            <Header/>
        </>
    )
}