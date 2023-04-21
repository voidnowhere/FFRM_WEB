import {Button, Card, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Report} from 'notiflix/build/notiflix-report-aio';
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "./Header.jsx";


function Booking() {
    const [date, setDate] = useState("");
    const [beginTime, setBeginTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [fields, setFields] = useState([]);
    const [fieldLocation, setFieldLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);


    useEffect(() => {
        axiosInstance.get("api/reservations/fields/").then((response) => {
            setFields(response.data);
        });
    }, []);
    const handleSubmit = (e, field) => {
        e.preventDefault();

        const beginDateTime = `${date}T${beginTime}:00Z`;
        const endDateTime = `${date}T${endTime}:00Z`;

        axiosInstance.post("api/reservations/", {
            field: field.id,
            begin_date_time: beginDateTime,
            end_date_time: endDateTime,
        }).then(() => {
            // handle successful reservation creation
            Report.success('Success',
                'Now you should pay you reservation ',
                'Okay',
            );
        }).catch((error) => {
            Report.failure(
                'Failure',
                (error.response.data.detail === undefined) ? 'Please provide a valid date and time' : error.response.data.detail,
                'Okay',
            );

        });
    };
    return (
        <>
            <Header/>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                Today
                            </InputGroup.Text>
                            <Form.Control
                                type="date"
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                Begin Time
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                type="time"
                                value={beginTime}
                                onChange={(e) => setBeginTime(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                End Time
                            </InputGroup.Text>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {/* code for cities */}
                <br/>
                <Row className="d-flex gap-4 justify-content-center">
                    {
                        fields.length > 0
                        &&
                        fields.map((field) => (
                            <Card key={field.id} style={{width: '18rem'}}>
                                <Card.Img variant="top" src={field.image}/>
                                <Card.Body>
                                    <Card.Title>{field.name}</Card.Title>
                                    <Card.Text>
                                        {field.id}
                                    </Card.Text>
                                    <Button variant="primary" onClick={(e) => handleSubmit(e, field)}>Book</Button>
                                    <Button variant="secondary" onClick={() => {
                                        setFieldLocation({latitude: field.latitude, longitude: field.longitude});
                                        setShowMap(true);
                                    }}>Map</Button>
                                </Card.Body>
                            </Card>
                        ))
                    }
                </Row>
                {
                    fieldLocation
                    &&
                    <Modal show={showMap} centered size="lg" onHide={() => setShowMap(false)}>
                        <Modal.Body>
                            <MapContainer center={[fieldLocation.latitude, fieldLocation.longitude]}
                                          style={{height: "75vh"}} zoom={13}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[fieldLocation.latitude, fieldLocation.longitude]}
                                        eventHandlers={{
                                            click: () => {
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${fieldLocation.latitude},${fieldLocation.longitude}`, "_blank");
                                            },
                                        }}>
                                </Marker>
                            </MapContainer>
                        </Modal.Body>
                    </Modal>
                }
            </Container>
        </>
    )
}

export default Booking;
