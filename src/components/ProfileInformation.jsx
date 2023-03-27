import Header from "./Header.jsx";
import {Button, Container, FloatingLabel, Form, FormControl} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Notify} from "notiflix/build/notiflix-notify-aio";

export default function ProfileInformation() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nic, setNic] = useState('');
    const [nicError, setNicError] = useState('');
    const [first_name, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [last_name, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    useEffect(() => {
        axiosInstance.get('api/users/profile/')
            .then((response) => {
                const data = response.data;
                setEmail(data.email);
                setNic(data.nic);
                setFirstName(data.first_name);
                setLastName(data.last_name);
            });
    }, []);

    function submit(event) {
        event.preventDefault();
        axiosInstance.put('api/users/profile/', {
            email: email,
            password: password,
            nic: nic,
            first_name: first_name,
            last_name: last_name,
        }).then((response) => {
            Notify.success(response.data.message, {
                'position': "center-bottom",
            });
            setEmailError('');
            setNicError('');
            setFirstNameError('');
            setLastNameError('');
            setPasswordError('');
            setPassword('');
        }).catch((error) => {
            const errors = error.response.data;
            setEmailError(errors.email);
            setNicError(errors.nic);
            setFirstNameError(errors.first_name);
            setLastNameError(errors.last_name);
            setPasswordError(errors.password);
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
                    <FloatingLabel label="NIC" className="mt-3">
                        <Form.Control type="text" placeholder="NIC" value={nic} required
                                      onChange={(e) => setNic(e.target.value.trim())}/>
                        <div className="text-danger">{nicError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="First name" className="mt-3">
                        <Form.Control type="text" placeholder="First name" value={first_name} required
                                      onChange={(e) => setFirstName(e.target.value.trim())}/>
                        <div className="text-danger">{firstNameError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="Last name" className="mt-3">
                        <Form.Control type="text" placeholder="Last name" value={last_name} required
                                      onChange={(e) => setLastName(e.target.value.trim())}/>
                        <div className="text-danger">{lastNameError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="Password" className="mt-3">
                        <Form.Control type="password" placeholder="Password" value={password} required
                                      onChange={(e) => setPassword(e.target.value.trim())}/>
                        <div className="text-danger">{passwordError}</div>
                    </FloatingLabel>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} size="lg" type="submit">Edit</Button>
                    </div>
                </Form>
            </Container>
        </>
    )
}