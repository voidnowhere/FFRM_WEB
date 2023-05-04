import {Button, Col, Form, Image, Modal, Row} from "react-bootstrap";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../../axiosInstance.js";
import {useEffect, useState} from "react";
import { Image } from 'react-bootstrap';
import ConsultMap from "./ConsultMap.jsx";

Notify.init({
    position: "center-top", // Notification position
    distance: "10px", // Distance between notifications
    opacity: 1, // Notification opacity
    borderRadius: "12px", // Border radius
    fontFamily: "inherit", // Font family
    fontSize: "16px", // Font size
    timeout: 3000,
});

function UpdateFieldForm({showModal, onHide, field,getFieldZone}) {
    const [updatedField, setUpdatedField] = useState(field);
    const [name, setName] = useState(updatedField?.name);
    const [address, setAddress] = useState(updatedField?.address);
    const [latitude, setLatitude] = useState(updatedField?.latitude);
    const [longitude, setLongitude] = useState(updatedField?.longitude);
    const [description, setDescription] = useState(updatedField?.description);
    const [type, setType] = useState(updatedField?.type);
    const [is_active, setIs_active] = useState(updatedField?.is_active);
    const [showMap, setShowMap] = useState(false);
    const [zoneId, setZoneId] = useState(updatedField?.zone);
    const [cityId, setCityId] = useState("");




    useEffect(() => {
        const fetchCity = async () => {
            const result = await axiosInstance.get(`/api/cities/${updatedField?.zone}/city`);
            setCityId(result.data.name);
            //console.log(result.data);
        };
        fetchCity();
    }, []);

    const handleShowMapChange = (e) => {
        setShowMap(e.target.checked);
    };


    const handleCoordsSelected = (coords) => {
        setLatitude(coords[0]);
        setLongitude(coords[1]);
    };


    return (
        <Modal show={showModal} onHide={onHide}
               size="xl"
               centered>
            <Modal.Header closeButton>
                <Modal.Title>{updatedField.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    readOnly

                                />

                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address}
                                    readOnly
                                />

                            </Form.Group>
                            <Form.Group controlId="formMap">
                                <Form.Label>Field Location</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Select location on map "
                                    checked={showMap}
                                    onChange={handleShowMapChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formLatitude">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={latitude}
                                    readOnly

                                />
                            </Form.Group>
                            <Form.Group controlId="formLongitude">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={longitude}
                                    readOnly

                                />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    value={description}
                                    readOnly
                                />

                            </Form.Group>

                            <Form.Group controlId="formIs_active">
                                <Form.Check
                                    type="checkbox"
                                    label="is_active"
                                    checked={is_active}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group controlId="formCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    value={cityId}
                                    readOnly
                                >
                                </Form.Control>
                            </Form.Group>

                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formZone">
                                <Form.Label>Zone</Form.Label>
                                <Form.Control
                                    value={getFieldZone(zoneId)}
                                    readOnly
                                >
                                </Form.Control>

                            </Form.Group>

                            <Form.Group>
                                <Form.Label>fieldType</Form.Label>
                                <Form.Control
                                    id="fieldTypeId"
                                    value={updatedField?.type.name}
                                    readOnly
                                >
                                </Form.Control>

                            </Form.Group>
                            <Form.Group controlId="formSoilType">
                                <Form.Label>Soil Type</Form.Label>
                                <Form.Control
                                    value={updatedField?.soil_type}
                                    readOnly
                                >
                                </Form.Control>

                            </Form.Group>
                            <Form.Group controlId="formImage">
                                <Form.Label>Field Picture</Form.Label>
                                    <Image
                                        src={updatedField?.image}
                                        fluid
                                        style={{maxHeight: "300px", marginRight: "10px"}}
                                    />

                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                {showMap && (
                    <Modal

                           centered
                           show={showMap}
                           onHide={() => {
                               setShowMap(false);
                           }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Field on Map</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ConsultMap lat={updatedField.latitude} long={updatedField.longitude} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowMap(false);
                                }}
                            >
                                Back
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateFieldForm;
