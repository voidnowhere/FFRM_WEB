import Header from "./Header.jsx";
import {Badge, Button, Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';
import {Report} from 'notiflix/build/notiflix-report-aio';

function AvailableReservations() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axiosInstance.get('api/temp_reservations/available/').then(response => {
            setReservations(response.data);
        });
    }, [])

    function joinReservation(reservationId) {
        Confirm.show(
            'Confirm',
            'Do you want to join this reservation?',
            'Yes',
            'No',
            () => {
                axiosInstance.patch(`api/temp_reservations/${reservationId}/join/`)
                    .then(response => {
                        const reservationIndex = reservations.findIndex((reservation) => reservation.id === reservationId);
                        const reservation = reservations[reservationIndex];
                        reservation.is_joined = true;
                        const newReservations = [...reservations];
                        newReservations[reservationIndex] = reservation;
                        setReservations(newReservations);
                        Report.success(
                            'Success',
                            response.data.message,
                            'Okay',
                            {backOverlay: false},
                        );
                    }).catch(error => {
                    if (error.response.status === 400) {
                        setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
                        Report.failure(
                            'Failure',
                            error.response.data.message,
                            'Okay',
                            {backOverlay: false},
                        );
                    }
                });
            },
            () => {
            },
            {},
        );
    }

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Begin</th>
                        <th>End</th>
                        <th>Football Field</th>
                        <th>Tags</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.begin_date_time}</td>
                            <td>{reservation.end_date_dime}</td>
                            <td>{reservation.field.name} {reservation.field.type.name}</td>
                            <td>
                                {
                                    (!reservation.is_joined) ?
                                        <Badge
                                            bg="primary">{reservation.available_places}
                                            {' '}Place{(reservation.available_places > 1) ? 's' : ''}
                                        </Badge> :
                                        <Badge bg="success">Joined</Badge>
                                }
                            </td>
                            <td>
                                {
                                    !reservation.is_joined
                                    &&
                                    <Button variant="outline-primary"
                                            onClick={() => joinReservation(reservation.id)}
                                    >Join</Button>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}

export default AvailableReservations;