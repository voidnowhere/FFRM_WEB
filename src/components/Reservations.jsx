import {Button, Container, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import Header from "./Header.jsx";


function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null)

    useEffect(() => {
        axiosInstance.get("reservations/").then((response) => {
            setReservations(response.data);
        });
    }, []);

    function deleteReservation(reservationId) {
        setShowModal(false);
        axiosInstance
            .delete(`reservations/${reservationId}`)
            .then((response) => {
                // Remove the deleted reservation from the state
                const updatedReservations = reservations.filter(
                    (reservation) => reservation.id !== reservationId
                );
                setReservations(updatedReservations);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    function confirmDeleteReservation(reservationId) {
        setReservationToDelete(reservationId);
        setShowModal(true);
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
    function handleCheckboxChange(reservationId, isChecked) {
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
        updateReservation(reservationId, { is_public: isChecked });
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
                                    onChange={(event) => handleCheckboxChange(reservation.id, event.target.checked)}
                                />
                            </td>
                            <td>{reservation.price}</td>
                            <td>{reservation.field.name}</td>
                            <td>
                                <Button
                                    className="btn btn-danger"
                                    onClick={() => confirmDeleteReservation(reservation.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>

                    ))}
                    </tbody>

                </Table>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this reservation?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => deleteReservation(reservationToDelete)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

export default Reservations;


