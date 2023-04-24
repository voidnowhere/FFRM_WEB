import Header from "./Header.jsx";
import {Button, Container, FloatingLabel, Form, FormControl} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Notify} from 'notiflix/build/notiflix-notify-aio';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userLogin} from "../features/user/userSlice.js";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (window.location.search.includes('session-expired')) {
            Notify.failure('Your session is expired!', {position: 'center-bottom'});
            navigate('/login');
        }
    }, []);

    function submit(event) {
        event.preventDefault();
        axiosInstance.post('api/token/', {
            email: email,
            password: password
        }).then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_type', response.data.type);
            dispatch(userLogin());
            setEmail('');
            setPassword('');
            Notify.success('Successful login', {
                position: 'center-bottom',
            });
            navigate('/');
        }).catch((error) => {
            if (error.response.status === 401) {
                Notify.failure('Your username or password is invalid', {
                    position: 'center-bottom',
                });
            }
            const errors = error.response.data;
            setEmailError(errors['email']);
            setPasswordError(errors['password']);
            setPassword('');
        });
    }

    return (
        <>
            <Header/>
            <Container className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-5 p-4 border rounded shadow">
                <Form onSubmit={submit}>
                    <FloatingLabel label="Email address">
                        <FormControl type="email" placeholder="name@example.com" value={email} required
                                     onChange={(e) => setEmail(e.target.value.trim())}/>
                        <div className="text-danger">{emailError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="Password" className="mt-3">
                        <Form.Control type="password" placeholder="Password" value={password} required
                                      onChange={(e) => setPassword(e.target.value.trim())}/>
                        <div className="text-danger">{passwordError}</div>
                    </FloatingLabel>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} size="lg" type="submit">Login</Button>
                    </div>
                </Form>
            </Container>
        </>
    )
}