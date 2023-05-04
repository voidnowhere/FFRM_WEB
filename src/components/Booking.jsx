import {Button, Card, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import axiosInstance from "../axiosInstance.js";
import {Report} from 'notiflix/build/notiflix-report-aio';
import {MapContainer, Marker, TileLayer, Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "./Header.jsx";
import marker_icon from '../assets/marker/marker-icon.png';
import marker_shadow from '../assets/marker/marker-shadow.png';
import marker_icon_2x from '../assets/marker/marker-icon-2x.png';
import ReactDatetimeClass from "react-datetime";
import dayjs from "dayjs";
import {FaClock, FaRegCalendarAlt} from "react-icons/all.js";
import {useSelector} from "react-redux";

const markerIcon = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: marker_icon,
    iconRetinaUrl: marker_icon_2x,
    shadowUrl: marker_shadow,
});

function Booking() {
    const DateTime = ReactDatetimeClass.default ?? ReactDatetimeClass;
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const dateTimeNow = dayjs().startOf('hour').add(1, 'hour');
    const [minHours, setMinHours] = useState(dayjs().add(1, 'hour').hour());
    const [maxHours, setMaxHours] = useState(24 - dayjs().add(1, 'hour').hour());
    const [numHours, setNumHours] = useState(1);
    const [beginDateTime, setBeginDateTime] = useState(dayjs().startOf('hour').add(1, 'hour').format('YYYY-MM-DD HH:mm'));
    const [fields, setFields] = useState([]);
    const [fieldLocation, setFieldLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);


    function getFields() {
        const endDateTime = (dayjs(beginDateTime).hour() === 23 && numHours === 1) ? dayjs(beginDateTime).add(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm') : dayjs(beginDateTime).add(numHours, 'hours').format('YYYY-MM-DD HH:mm');
        navigator.geolocation.getCurrentPosition(
            position => {
                const positionCords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setCurrentPosition(positionCords);
                axiosInstance.post("api/bookings/fields/", {
                    begin_date_time: beginDateTime,
                    end_date_time: endDateTime,
                    latitude: positionCords.latitude,
                    longitude: positionCords.longitude,
                }).then((response) => {
                    setFields(response.data);
                }).catch((error) => {
                    Report.failure(
                        'Failure',
                        (error.response.detail === undefined) ? 'Please provide a valid date and time' : error.response.data.detail,
                        'Okay',
                        () => null,
                        {backOverlay: false}
                    );
                });
            },
            () => {
                axiosInstance.post("api/booking/fields/", {
                    begin_date_time: beginDateTime,
                    end_date_time: endDateTime
                }).then((response) => {
                    setFields(response.data);
                }).catch((error) => {
                    Report.failure(
                        'Failure',
                        (error.response.detail === undefined) ? 'Please provide a valid date and time' : error.response.data.detail,
                        'Okay',
                        () => null,
                        {backOverlay: false}
                    );
                });
            }
        );
    }

    useEffect(() => {
        const now = dayjs();
        if (dayjs(beginDateTime).isAfter(now, 'date')) {
            setMinHours(null);
        } else {
            setMinHours(now.add(1, 'hour').hour());
        }
        setMaxHours(24 - dayjs(beginDateTime).hour());
    }, [beginDateTime]);

    useEffect(() => {
        getFields();
    }, []);

    const handleSubmit = (e, field) => {
        e.preventDefault();
        if (!isAuthenticated) {
            Report.failure(
                'Failure',
                'You should singed in before confirm booking ',
                'Okay',
                () => null,
                {backOverlay: false}
            );
            return;
        }
        const endDateTime = dayjs(beginDateTime).add(numHours, 'hours').format('YYYY-MM-DD HH:mm');
        axiosInstance.post("api/reservations/", {
            field: field.id,
            begin_date_time: beginDateTime,
            end_date_time: endDateTime,
        }).then(() => {
            // handle successful reservation creation
            Report.success('Success',
                'Now you should pay you reservation ',
                'Okay',
                () => null,
                {backOverlay: false}
            );
        }).catch((error) => {
            Report.failure(
                'Failure',
                (error.response.data.detail === undefined) ? 'Please provide a valid date and time' : error.response.data.detail,
                'Okay',
                () => null,
                {backOverlay: false}
            );
        });
    };


    return (
        <>
            <Header/>
            <Container className="mt-md-5">
                <Row>
                    <Col>
                        <label><strong>Select a date and time: </strong> <FaRegCalendarAlt/></label>

                        <DateTime
                            timeConstraints={{minutes: {step: 60}, hours: {min: minHours}}}
                            timeFormat='HH:mm'
                            value={beginDateTime}
                            dateFormat={'YYYY-MM-DD'}
                            isValidDate={(currentDate) => {
                                return dayjs(currentDate).isAfter(dateTimeNow, 'date') ||
                                    dayjs(currentDate).isSame(dateTimeNow, 'date');
                            }}
                            onChange={moment => setBeginDateTime(moment.toDate())}

                        />

                    </Col>

                    <Col>
                        <label><strong>How many hours:</strong> <FaClock/></label>

                        <InputGroup className="mb-3">

                            <Form.Control
                                required={true}
                                aria-label="Default"
                                max={maxHours}
                                min={1}
                                type={'number'}
                                value={numHours}
                                onChange={(e) => setNumHours((parseInt(e.target.value) > maxHours) ? maxHours : e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <br/>
                <Row>

                    <Button onClick={() => getFields()}>Search</Button>

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
                                    <Card.Title><strong>{field.name}</strong></Card.Title>
                                    <Card.Text>
                                        <strong>Type: </strong> {field.type.name}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Max players: </strong> {field.type.max_players}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Price per hour: </strong>{field.type.price_per_hour}
                                    </Card.Text>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary"
                                                onClick={(e) => handleSubmit(e, field)}>Book</Button>
                                        <Button variant="outline-secondary" onClick={() => {
                                            setFieldLocation({latitude: field.latitude, longitude: field.longitude});
                                            setShowMap(true);
                                        }}>Map</Button>
                                    </div>
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
                                {
                                    currentPosition
                                    &&
                                    <Marker position={[currentPosition.latitude, currentPosition.longitude]}
                                            icon={markerIcon}>
                                        <Tooltip direction="top" offset={[-15, -15]} permanent>Your location</Tooltip>
                                    </Marker>
                                }
                                <Marker position={[fieldLocation.latitude, fieldLocation.longitude]} icon={markerIcon}
                                        eventHandlers={{
                                            click: () => {
                                                if (currentPosition !== null) {
                                                    window.open(`https://www.google.com/maps/dir/${currentPosition.latitude},${currentPosition.longitude}/${fieldLocation.latitude},${fieldLocation.longitude}`, "_blank");
                                                } else {
                                                    window.open(`https://www.google.com/maps/search/?api=1&query=${fieldLocation.latitude},${fieldLocation.longitude}`, "_blank");
                                                }
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
