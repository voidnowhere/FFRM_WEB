import {Button, Card, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import axiosInstance from "../axiosInstance.js";
import {Report} from 'notiflix/build/notiflix-report-aio';
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "./Header.jsx";
import marker_icon from '../assets/marker/marker-icon.png';
import marker_shadow from '../assets/marker/marker-shadow.png';
import marker_icon_2x from '../assets/marker/marker-icon-2x.png';
import {baseURL} from "../axiosInstance.js";

const markerIcon = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: marker_icon,
    iconRetinaUrl: marker_icon_2x,
    shadowUrl: marker_shadow,
});

function Booking() {
    const dateRef = useRef();
    const beginTimeRef = useRef();
    const endTimeRef = useRef();
    const [fields, setFields] = useState([]);
    const [fieldLocation, setFieldLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);

    function getFields() {
        const date =new Date( Date.parse(dateRef.current.value))
        const beginDateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${beginTimeRef.current.value}`;
        const endDateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${endTimeRef.current.value}`;


        axiosInstance.post("api/reservations/fields/", {
            begin_date_time: beginDateTime,
            end_date_time: endDateTime
        }).then((response) => {
            setFields(response.data);
        }).catch((error) => {
            Report.failure(
                'Failure',
                (error.response.data.detail === undefined) ? 'Please provide a valid date and time' : error.response.data.detail,
                'Okay',
            );

        });
    }

    const handleSubmit = (e, field) => {
        e.preventDefault();
        const date =new Date( Date.parse(dateRef.current.value))

        const beginDateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${beginTimeRef.current.value}`;
        const endDateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${endTimeRef.current.value}`;

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
                                ref={dateRef}
                                type="date"
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                Begin Time
                            </InputGroup.Text>
                            <Form.Control ref={beginTimeRef} type="time"/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="inputGroup-sizing-default">
                                End Time
                            </InputGroup.Text>
                            <Form.Control
                                ref={endTimeRef}
                                type="time"
                            />
                        </InputGroup>
                    </Col>
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
                                <Card.Img variant="top" src={baseURL.slice(0, -1) + field.image}/>
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
                                <Marker position={[fieldLocation.latitude, fieldLocation.longitude]} icon={markerIcon}
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
