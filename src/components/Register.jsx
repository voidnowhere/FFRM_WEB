import {useRef, useState} from "react";
import axiosInstance from '../axiosInstance.js';
import {Button, ButtonGroup, Container, FloatingLabel, Form, FormControl} from "react-bootstrap";
import {Notify} from 'notiflix/build/notiflix-notify-aio';
import Header from "./Header.jsx";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const emailRef = useRef();
    const [emailError, setEmailError] = useState('');
    const passwordRef = useRef();
    const [passwordError, setPasswordError] = useState('');
    const nicRef = useRef();
    const [nicError, setNicError] = useState('');
    const firstNameRef = useRef();
    const [firstNameError, setFirstNameError] = useState('');
    const lastNameRef = useRef();
    const [lastNameError, setLastNameError] = useState('');
    const [isPlayerType, setIsPlayerType] = useState(false);
    const [isOwnerType, setIsOwnerType] = useState(false);
    const [userTypeError, setUserTypeError] = useState('');

    function submit(event) {
        event.preventDefault();
        if (!isPlayerType && !isOwnerType) {
            setUserTypeError('This field is required.');
            return;
        }
        axiosInstance.post('api/users/register/', {
            type: (isPlayerType) ? 'P' : (isOwnerType) ? 'O' : '',
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value.trim(),
            nic: nicRef.current.value.trim(),
            first_name: firstNameRef.current.value.trim(),
            last_name: lastNameRef.current.value.trim(),
        }).then((response) => {
            emailRef.current.value = '';
            passwordRef.current.value = '';
            nicRef.current.value = '';
            firstNameRef.current.value = '';
            lastNameRef.current.value = '';
            setEmailError('');
            setNicError('');
            setFirstNameError('');
            setLastNameError('');
            setPasswordError('');
            Notify.success(response.data['message'], {
                position: 'center-bottom',
            });
            navigate('/login');
        }).catch((error) => {
            const errors = error.response.data;
            setUserTypeError((errors.type) ? 'This field is required.' : '');
            setEmailError(errors.email);
            setNicError(errors.nic);
            setFirstNameError(errors.first_name);
            setLastNameError(errors.last_name);
            setPasswordError(errors.password);
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
                        <div className="text-danger">{emailError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="NIC" className="mt-3">
                        <Form.Control ref={nicRef} type="text" placeholder="NIC" required/>
                        <div className="text-danger">{nicError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="First name" className="mt-3">
                        <Form.Control ref={firstNameRef} type="text" placeholder="First name" required/>
                        <div className="text-danger">{firstNameError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="Last name" className="mt-3">
                        <Form.Control ref={lastNameRef} type="text" placeholder="Last name" required/>
                        <div className="text-danger">{lastNameError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="Password" className="mt-3">
                        <Form.Control ref={passwordRef} type="password" placeholder="Password" required/>
                        <div className="text-danger">{passwordError}</div>
                    </FloatingLabel>
                    <div className="mt-3">
                        <ButtonGroup aria-label="Type" className="d-flex">
                            <Button variant="light" active={isPlayerType} onClick={() => {
                                setIsPlayerType(true);
                                setIsOwnerType(false);
                            }}>Player</Button>
                            <Button variant="light" active={isOwnerType} onClick={() => {
                                setIsOwnerType(true);
                                setIsPlayerType(false);
                            }}>Owner</Button>
                        </ButtonGroup>
                        <div className="text-danger">{userTypeError}</div>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} size="lg" type="submit">Register</Button>
                    </div>
                </Form>
            </Container>
        </>
    )
}
