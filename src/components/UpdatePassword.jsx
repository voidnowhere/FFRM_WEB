import Header from "./Header.jsx";
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import {useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Notify} from "notiflix/build/notiflix-notify-aio";

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [confirmationError, setConfirmationError] = useState('');

    function submit(event) {
        event.preventDefault();
        axiosInstance.patch('api/users/update_password/', {
            password: password,
            new_password: new_password,
            confirmation: confirmation,
        }).then((response) => {
            setPassword('');
            setPasswordError('');
            setNewPassword('');
            setNewPasswordError('');
            setConfirmation('');
            setConfirmationError('');
            Notify.success(response.data['message'], {
                position: 'center-bottom',
            });
        }).catch((error) => {
            const errors = error.response.data;
            setPasswordError(errors.password);
            setNewPasswordError(errors.new_password);
            setConfirmationError(errors.confirmation);
            setPassword('');
            setNewPassword('');
            setConfirmation('');
        });
    }

    return (
        <>
            <Header/>
            <Container className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-5 p-4 border rounded shadow">
                <Form onSubmit={submit} noValidate>
                    <FloatingLabel label="Password" className="mt-3">
                        <Form.Control type="password" placeholder="Password" value={password} required
                                      onChange={(e) => setPassword(e.target.value.trim())}/>
                        <div className="text-danger">{passwordError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="New password" className="mt-3">
                        <Form.Control type="password" placeholder="New password" value={new_password} required
                                      onChange={(e) => setNewPassword(e.target.value.trim())}/>
                        <div className="text-danger">{newPasswordError}</div>
                    </FloatingLabel>
                    <FloatingLabel label="Confirmation" className="mt-3">
                        <Form.Control type="password" placeholder="Confirmation" value={confirmation} required
                                      onChange={(e) => setConfirmation(e.target.value.trim())}/>
                        <div className="text-danger">{confirmationError}</div>
                    </FloatingLabel>
                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} size="lg" type="submit">Update</Button>
                    </div>
                </Form>
            </Container>
        </>
    )
}