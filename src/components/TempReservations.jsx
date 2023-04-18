import Header from "./Header.jsx";
import {Badge, Button, Container, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./Checkout/CheckoutForm.jsx";
import {Report} from 'notiflix/build/notiflix-report-aio';
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function TempReservations() {
    const [reservations, setReservations] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currentReservationId, setCurrentReservationId] = useState(null);

    useEffect(() => {
        axiosInstance.get('api/temp_reservations/').then(response => {
            setReservations(response.data);
        });
    }, []);

    function initPayment(reservationId) {
        Confirm.show(
            'Confirm',
            'Do you really want to pay ?',
            'Yes',
            'No',
            () => {
                axiosInstance.get(`api/temp_reservations/${reservationId}/payment/`).then(response => {
                    setClientSecret(response.data.client_secret);
                    setCurrentReservationId(reservationId);
                    setShowPaymentModal(true);
                }).catch(error => {
                    setReservations(reservations.map(reservation => {
                        if (reservation.id === reservationId) {
                            reservation.can_pay = false;
                        }
                        return reservation;
                    }));
                    Report.failure(
                        'Failure',
                        error.response.data.message,
                        'Okay',
                        {backOverlay: false}
                    );
                });
            },
        );
    }

    return (
        <>
            <Header/>
            <Container className="mt-5">
                <h3 className="mb-5">Temp reservations</h3>
                <Table hover striped className="rounded shadow">
                    <thead>
                    <tr>
                        <th>Football Field</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Price</th>
                        <th>Tags</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id} className="align-middle">
                            <td>{reservation.field.name} {reservation.field.type.name}</td>
                            <td>{reservation.date}</td>
                            <td>{reservation.begin_time.slice(0, -3)}{' '}{reservation.end_time.slice(0, -3)}</td>
                            <td>{reservation.price_to_pay} DH</td>
                            <td>
                                <div className="d-flex flex-wrap align-items-stretch gap-2">
                                    {
                                        (reservation.is_paid) ?
                                            <Badge bg="success">Paid</Badge>
                                            :
                                            <Badge bg="danger">Unpaid</Badge>
                                    }
                                    {
                                        !reservation.can_pay
                                        &&
                                        <Badge bg="danger">Unavailable</Badge>
                                    }
                                </div>
                            </td>
                            <td>
                                {
                                    !reservation.is_paid && reservation.can_pay
                                    &&
                                    <Button variant="outline-primary" size="sm"
                                            onClick={() => initPayment(reservation.id)}
                                    >Pay</Button>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
                    <Modal.Body>
                        <Elements options={{clientSecret, appearance: {theme: 'stripe'}}} stripe={stripePromise}>
                            <CheckoutForm setShowPaymentModal={setShowPaymentModal} setReservations={setReservations}
                                          currentReservationId={currentReservationId}/>
                        </Elements>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    )
}

export default TempReservations;