import {Button, Container, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import Header from "./Header.jsx";
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';


function Reservations() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axiosInstance.get("reservations/").then((response) => {
            setReservations(response.data);
        });
    }, []);

    function deleteReservation(reservationId) {
        Confirm.show(
            'Notiflix Confirm',
            'Do you agree with me?',
            'Yes',
            'No',
            () => {
                axiosInstance
                    .delete(`reservations/${reservationId}`)
                    .then(() => {
                        // Remove the deleted reservation from the state
                        const updatedReservations = reservations.filter(
                            (reservation) => reservation.id !== reservationId
                        );
                        setReservations(updatedReservations);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        )

    }

    function updateReservation(id, data) {
        axiosInstance
            .put(`reservations/${id}/`, data)
            .then((response) => {
                // Find the updated reservation and replace it in the state
                const updatedReservation = response.data;
                const updatedReservations = reservations.map((reservation) => {
                    if (reservation.id === updatedReservation.id) {
                        return updatedReservation;
                    }
                    return reservation;
                });
                setReservations(updatedReservations);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleCheckboxChange(event, reservationId, isChecked) {
        Confirm.show(
            'Notiflix Confirm',
            'Do you agree with me?',
            'Yes',
            'No',
            () => {
                const updatedReservations = reservations.map(reservation => {
                    if (reservation.id === reservationId) {
                        return {
                            ...reservation,
                            is_public: isChecked
                        };
                    }
                    return reservation;
                });
                setReservations(updatedReservations);
                updateReservation(reservationId, {is_public: isChecked});
            },
            () => {
                event.target.checked = false;
            },
        )
    }

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Start Date Time</th>
                        <th>End Date Time</th>
                        <th>Is Public</th>
                        <th>Price</th>
                        <th>Field</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.begin_date_time}</td>
                            <td>{reservation.end_date_time}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    defaultChecked={reservation.is_public}
                                    onChange={(event) => handleCheckboxChange(event, reservation.id, event.target.checked)}
                                />
                            </td>
                            <td>{reservation.price}</td>
                            <td>{reservation.field.name}</td>
                            <td>
                                <Button
                                    className="btn btn-danger"
                                    onClick={() => deleteReservation(reservation.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>

                    ))}
                    </tbody>

                </Table>
            </Container>
        </>
    );
}

export default Reservations;


