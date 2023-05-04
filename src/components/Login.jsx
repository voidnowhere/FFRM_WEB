import Header from "./Header.jsx";
import {Button, Container, FloatingLabel, Form, FormControl} from "react-bootstrap";
import {useEffect, useRef} from "react";
import axiosInstance from "../axiosInstance.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userLogin} from "../features/user/userSlice.js";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (window.location.search.includes('session-expired')) {
            Notify.failure('Your session is expired!', {position: 'center-bottom'});
            navigate('/login');
        }
    }, []);

    function submit(event) {
        event.preventDefault();
        axiosInstance.post('api/token/', {
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value.trim()
        }).then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_type', response.data.type);
            dispatch(userLogin());
            passwordRef.current.value = '';
            Notify.success('Successful login.', {
                position: 'center-bottom',
            });
            navigate('/');
        }).catch((error) => {
            if (error.response.status === 401) {
                Notify.failure('Your email or password is invalid!', {
                    position: 'center-bottom',
                });
            }
            passwordRef.current.value = '';
        });
    }

    return (
        <>
            <Header/>
            <Container className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-5 p-4 border rounded shadow">
                <Form onSubmit={submit}>
                    <FloatingLabel label="Email address">
                        <FormControl ref={emailRef} type="email" placeholder="name@example.com" required/>
                    </FloatingLabel>
                    <FloatingLabel label="Password" className="mt-3">
                        <Form.Control ref={passwordRef} type="password" placeholder="Password" required/>
                    </FloatingLabel>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} size="lg" type="submit">Login</Button>
                    </div>
                </Form>
            </Container>
        </>
    )
}