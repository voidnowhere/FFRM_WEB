import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../../axiosInstance.js";
import {useEffect, useState} from "react";
import Map from "./Map";

Notify.init({
    position: "center-top", // Notification position
    distance: "10px", // Distance between notifications
    opacity: 1, // Notification opacity
    borderRadius: "12px", // Border radius
    fontFamily: "inherit", // Font family
    fontSize: "16px", // Font size
    timeout: 3000,
});

function UpdateFieldForm({showModal, onHide, field, cities, updateField, currentLocation}) {
    const [updatedField, setUpdatedField] = useState(field);
    const [id, setId] = useState(updatedField?.id);
    const [name, setName] = useState(updatedField?.name);
    const [address, setAddress] = useState(updatedField?.address);
    const [latitude, setLatitude] = useState(updatedField?.latitude);
    const [longitude, setLongitude] = useState(updatedField?.longitude);
    const [description, setDescription] = useState(updatedField?.description);
    const [type, setType] = useState(updatedField?.type);
    const [is_active, setIs_active] = useState(updatedField?.is_active);

    const [soilType, setSoilType] = useState(updatedField?.soil_type);
    const TYPE_CHOICES = ["naturelle", "synthetique"];
    const [nameError, setNameError] = useState([]);
    const [addressError, setAddressError] = useState([]);
    const [descriptionError, setDescriptionError] = useState([]);
    const [zones, setZones] = useState([]);
    const [field_types, setField_types] = useState([]);
    const [zoneError, setZoneError] = useState([]);
    const [typeError, setTypeError] = useState([]);
    const [soilTypeError, setSoilTypeError] = useState([]);
    const [imageError, setImageError] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [zoneId, setZoneId] = useState(updatedField?.zone);
    const [cityId, setCityId] = useState("");
    const [oldImage, setOldImage] = useState(updatedField?.image);
    const [image, setImage] = useState("");


    useEffect(() => {
        const fetchFieldTypes = async () => {
            const result = await axiosInstance.get("/api/field_types/");
            setField_types(result.data);
            // console.log(result.data);
        };
        fetchFieldTypes();
    }, []);

    useEffect(() => {
        const fetchFieldTypes = async () => {
            const result = await axiosInstance.get("/api/zones/");
            setZones(result.data);
            // console.log(result.data);
        };
        fetchFieldTypes();
    }, []);

    useEffect(() => {
        const fetchCity = async () => {
            const result = await axiosInstance.get(`/api/cities/${updatedField?.zone}/city`);
            setCityId(result.data.id);
            //console.log(result.data);
        };
        fetchCity();
    }, []);

    const handleShowMapChange = (e) => {
        setShowMap(e.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("is_active", is_active);
        formData.append("soil_type", soilType);
        formData.append("zone", zoneId);
        if (image) {
            formData.append("image", image);
        }

        setUpdatedField(field);
        // console.log(field);
        axiosInstance({
            method: 'put',
            url: `/api/fields/${updatedField.id}/`,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                //console.log(response);

                Notify.success("Field updated successfully.");
                // Reset the form fields
                // Call the onAddField callback function to refresh the list of fields
                updateField(response.data);
                onHide();
            })
            .catch((error) => {
                const errors = error.response.data;
                console.log(errors);
                setNameError(errors.name);
                setAddressError(errors.address);
                setDescriptionError(errors.description);
                setSoilTypeError(errors.soil_type);
                setZoneError(errors.zone);
                setTypeError(errors.type);
                setImageError(errors.image);
                Notify.failure("Failed to update field.");
            });
    };
    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setCityId(cityId);
        axiosInstance.get(`/api/zones/city=${cityId}`)
            .then((response) => {
                setZones(response.data);
            });
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
                <Modal.Title>Edit Field</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="myForm" onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                                <div className="text-danger">{nameError}</div>
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                    required
                                />
                                <div className="text-danger">{addressError}</div>
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
                                    onChange={(event) => setLatitude(event.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formLongitude">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={longitude}
                                    onChange={(event) => setLongitude(event.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                                <div className="text-danger">{descriptionError}</div>
                            </Form.Group>

                            <Form.Group controlId="formIs_active">
                                <Form.Check
                                    type="checkbox"
                                    label="is_active"
                                    checked={is_active}
                                    onChange={(event) => setIs_active(event.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formZone">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={cityId}
                                    onChange={handleCityChange}
                                >
                                    <option value="">--Select a city--</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>


                            <Form.Group controlId="formZone">
                                <Form.Label>Zone</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={zoneId}
                                    onChange={(event) => setZoneId(event.target.value)}
                                >
                                    <option value="">--Select a zone--</option>
                                    {zones.map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.name}
                                        </option>
                                    ))}
                                </Form.Control>
                                <div className="text-danger">{zoneError}</div>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>fieldType</Form.Label>
                                <Form.Select
                                    id="fieldTypeId"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option>--Select a type--</option>
                                    {field_types &&
                                        field_types.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                </Form.Select>
                                <div className="text-danger">{typeError}</div>
                            </Form.Group>
                            <Form.Group controlId="formSoilType">
                                <Form.Label>Soil Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={soilType}
                                    onChange={(event) => setSoilType(event.target.value)}
                                >
                                    <option value="">Choose...</option>
                                    {TYPE_CHOICES.map((choice, index) => (
                                        <option key={index} value={choice}>
                                            {choice}
                                        </option>
                                    ))}
                                </Form.Control>
                                <div className="text-danger">{soilTypeError}</div>
                            </Form.Group>
                            <Form.Group controlId="formImage">
                                <Form.Label>Field Picture</Form.Label>

                                <div className="d-flex align-items-center">
                                    {image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="New field image"
                                            style={{maxHeight: "100px", marginRight: "10px"}}
                                        />
                                    ) : oldImage ? (
                                        <img
                                            src={oldImage}
                                            alt="Old field image"
                                            style={{maxHeight: "100px", marginRight: "10px"}}
                                        />
                                    ) : null}
                                    <Form.Control
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>

                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button type="submit" variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
                {showMap && (
                    <Modal size="lg"
                           aria-labelledby="contained-modal-title-vcenter"
                           centered
                           show={showMap}
                           onHide={() => {
                               setShowMap(false);
                           }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Choose location on Map</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Map onSelect={handleCoordsSelected} center={currentLocation}/>
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
