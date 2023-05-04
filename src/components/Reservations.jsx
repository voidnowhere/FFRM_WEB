import Header from "./Header.jsx";
import {
    Badge,
    Button,
    Container,
    FloatingLabel,
    Form,
    ListGroup,
    Modal,
    OverlayTrigger,
    Table,
    Tooltip
} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./Checkout/CheckoutForm.jsx";
import {Report} from 'notiflix/build/notiflix-report-aio';
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';
import jwt_decode from "jwt-decode";
import {Notify} from 'notiflix/build/notiflix-notify-aio';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const loggedInPlayerId = (localStorage.getItem('access_token') !== null) ?
    jwt_decode(localStorage.getItem('access_token')).user_id : null;

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currentReservationId, setCurrentReservationId] = useState(null);
    const [showPlayersModal, setShowPlayersModal] = useState(false);
    const [reservationPlayers, setReservationPlayers] = useState([]);
    const playerEmailRef = useRef();

    useEffect(() => {
        axiosInstance.get('api/reservations/').then(response => {
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
                axiosInstance.get(`api/reservations/${reservationId}/payment/`).then(response => {
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

    function getPlayers(reservationId) {
        axiosInstance.get(`api/reservations/${reservationId}/players/`).then(response => {
            setShowPlayersModal(true);
            setReservationPlayers(response.data.players);
            setCurrentReservationId(reservationId);
        });
    }

    function invitePlayer(event, reservationId, playerEmail) {
        event.preventDefault();
        axiosInstance.patch(`api/reservations/${reservationId}/players/invite/`, {
            email: playerEmail,
        }).then((response) => {
            getPlayers(reservationId);
            playerEmailRef.current.value = '';
            Report.success(
                'Success',
                response.data.message,
                'Okay',
                {backOverlay: false}
            );
        }).catch((error) => {
            playerEmailRef.current.value = '';
            if (error.response.status === 400) {
                Report.failure(
                    'Failure',
                    (error.response.data.message === undefined) ? error.response.data.email[0] : error.response.data.message,
                    'Okay',
                    {backOverlay: false}
                );
            }
        });
    }

    function removePlayer(event, reservationId, playerId) {
        event.preventDefault();
        Confirm.show(
            'Confirm',
            'Do you want to remove this player?',
            'Yes',
            'No',
            () => {
                axiosInstance.patch(`api/reservations/${reservationId}/players/remove/`, {
                    id: playerId,
                }).then((response) => {
                    getPlayers(reservationId);
                    Report.success(
                        'Success',
                        response.data.message,
                        'Okay',
                        {backOverlay: false}
                    );
                }).catch((error) => {
                    if (error.response.status === 400) {
                        Report.failure(
                            'Failure',
                            (error.response.data.message === undefined) ? 'Error' : error.response.data.message,
                            'Okay',
                            {backOverlay: false}
                        );
                    }
                });
            },
        )
    }

    function deleteReservation(reservationId) {
        Confirm.show(
            'Confirmation',
            'Do you want to delete this reservation ?',
            'Yes',
            'No',
            () => {
                axiosInstance
                    .delete(`api/reservations/${reservationId}/delete/`)
                    .then(() => {
                        setReservations(prevState => prevState.filter(
                            (reservation) => reservation.id !== reservationId
                        ));
                        Notify.success(
                            `Reservation deleted successfully.`,
                            {position: 'center-bottom', fontSize: '10'}
                        );
                    })
                    .catch((error) => {
                    if (error.response.status === 400) {
                        Report.failure(
                            'Failure',
                            (error.response.data.message === undefined) ? 'Reservation has already begun and cannot be deleted.' : error.response.data.message,
                            'Okay',
                            {backOverlay: false}
                        );
                    }
                });
            },
        )

    }

    function handleCheckboxChange(event, reservationId, isChecked) {
        Confirm.show(
            'Confirm',
            'Do you want to make this reservation Public ?',
            'Yes',
            'No',
            () => {
                axiosInstance.patch(`api/reservations/${reservationId}/update/`, {
                    is_public: isChecked
                }).then(() => {
                    setReservations((prevState) => prevState.map((reservation) => {
                            if (reservation.id === reservationId) {
                                reservation.is_public = !reservation.is_public;
                            }
                            return reservation;
                        })
                    );
                    Notify.success(
                        `Reservation made ${(isChecked) ? 'public' : 'private'} successfully.`,
                        {position: 'center-bottom', fontSize: '10'}
                    );
                }).catch((error) => {
                    console.log(error);
                });
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
                <h3 className="mb-5">Reservations</h3>
                <Table hover striped className="rounded shadow">
                    <thead>
                    <tr>
                        <th>Football Field</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Public</th>
                        <th>Price</th>
                        <th>Tags</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        reservations.length > 0
                        &&
                        reservations.map((reservation) => (
                            <tr key={reservation.id} className="align-middle">
                                <td>{reservation.field.name} {reservation.field.type.name}</td>
                                <td>{reservation.date}</td>
                                <td>{reservation.begin_time.slice(0, -3)}{' '}{reservation.end_time.slice(0, -3)}</td>
                                <td>
                                    <Form.Check type="checkbox" defaultChecked={reservation.is_public}
                                                onChange={(event) => handleCheckboxChange(event, reservation.id, event.target.checked)}/>
                                </td>
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
                                    <div className="d-flex flex-wrap gap-2">
                                        {
                                            !reservation.is_paid && reservation.can_pay
                                            &&
                                            <Button variant="outline-primary" size="sm"
                                                    onClick={() => initPayment(reservation.id)}
                                            >Pay</Button>
                                        }
                                        <Button variant="outline-success" size="sm"
                                                onClick={() => getPlayers(reservation.id)}
                                        >Invite</Button>
                                        <Button variant="outline-danger" size="sm"
                                                onClick={() => deleteReservation(reservation.id)}
                                        >Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                <Modal show={showPaymentModal} centered onHide={() => setShowPaymentModal(false)}>
                    <Modal.Body>
                        <Elements options={{clientSecret, appearance: {theme: 'stripe'}}} stripe={stripePromise}>
                            <CheckoutForm setShowPaymentModal={setShowPaymentModal}
                                          setReservations={setReservations}
                                          currentReservationId={currentReservationId}/>
                        </Elements>
                    </Modal.Body>
                </Modal>
                <Modal show={showPlayersModal} centered onHide={() => setShowPlayersModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Players</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="mb-3 d-flex justify-content-center align-items-center"
                              onSubmit={(event) => invitePlayer(event, currentReservationId, playerEmailRef.current.value)}>
                            <FloatingLabel label="Player email" className="flex-grow-1 me-3">
                                <Form.Control ref={playerEmailRef} type="email" required
                                              placeholder="name@example.com"/>
                            </FloatingLabel>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" size="sm">
                                    <i className="bi bi-person-plus-fill"></i>
                                </Button>
                            </div>
                        </Form>
                        {
                            reservationPlayers.length > 0
                            &&
                            <ListGroup>
                                {reservationPlayers.filter((player) => player.id === loggedInPlayerId).map((player) => (
                                    <ListGroup.Item key={player.id} active>
                                        <OverlayTrigger placement="top" delay={{show: 250, hide: 400}}
                                                        overlay={<Tooltip>{player.email}</Tooltip>}>
                                            <div>{player.last_name} {player.first_name} </div>
                                        </OverlayTrigger>
                                    </ListGroup.Item>
                                ))}
                                {reservationPlayers.filter((player) => player.id !== loggedInPlayerId).map((player) => (
                                    <ListGroup.Item key={player.id}>
                                        <div
                                            className="d-flex justify-content-between align-items-center flex-grow-1 pe-2">
                                            <OverlayTrigger placement="top" delay={{show: 250, hide: 400}}
                                                            overlay={<Tooltip>{player.email}</Tooltip>}>
                                                <div>{player.last_name} {player.first_name} </div>
                                            </OverlayTrigger>
                                            <Button variant="danger" size="sm"
                                                    onClick={(event) => removePlayer(event, currentReservationId, player.id)}>
                                                <i className="bi bi-person-dash-fill"></i>
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        }
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
}

export default Reservations;


