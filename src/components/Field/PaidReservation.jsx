import {useEffect, useState} from "react";
import axiosInstance from "../../axiosInstance.js";
import Header from "../Header.jsx";
import {Col, Container, Row, Table} from "react-bootstrap";
import ReservationCalendar from './ReservationCalendar';

function PaidReservation() {
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        axiosInstance.get('api/fields/paid_reservations/').then(response => {
            setReservations(response.data);
            console.log(response.data);
        });
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredReservations = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        return reservationDate.getDate() === selectedDate.getDate()
            && reservationDate.getMonth() === selectedDate.getMonth()
            && reservationDate.getFullYear() === selectedDate.getFullYear();
    });
    console.log(filteredReservations);
    return (
        <>
            <Header/>
            <Container className="mt-5">
                <h3 className="mb-5">Paid Reservations</h3>
                <Row>
                    <Col sm={3}>
                        <ReservationCalendar
                            selectedDate={selectedDate}
                            onDateChange={handleDateChange}
                        />
                    </Col>
                    <Col sm={9}>
                        <Table hover striped className="rounded shadow mt-3">
                            <thead>
                            <tr>
                                <th>Field</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Amount (MAD)</th>
                                <th>Owner</th>
                                <th>Players</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredReservations.length > 0 &&
                                filteredReservations.map((reservation) => (
                                    <tr key={reservation.id} className="align-middle">
                                        <td>{reservation.field.name} {reservation.field.type.name}</td>
                                        <td>{reservation.date}</td>
                                        <td>{reservation.begin_time.slice(0, -3)}{' '}{reservation.end_time.slice(0, -3)}</td>
                                        <td>{reservation.total_amount}</td>
                                        <td>{reservation.owner.last_name}</td>
                                        <td>{reservation.players_count} / {reservation.field.type.max_players}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default PaidReservation;
