import React, { useState, useEffect } from "react";
import {Form, Button, Modal, Row, Col} from "react-bootstrap";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../../axiosInstance.js";
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
const TYPE_CHOICES = ["naturelle", "synthetique"];

function AddFieldForm({
  getFields,
  fieldTypes,
  show,
  cities,
  handleClose,
  currentLocation,
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [is_active, setIs_active] = useState(false);
  const [soil_type, setSoil_type] = useState("");
  const [image, setImage] = useState("");
  const [zone, setZone] = useState("");
  const [cityId, setCityId] = useState("");
  const [zones, setZones] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [nameError, setNameError] = useState([]);
  const [addressError, setAddressError] = useState([]);
  const [descriptionError, setDescriptionError] = useState([]);
  const [zoneError, setZoneError] = useState([]);
  const [typeError, setTypeError] = useState([]);
  const [soilTypeError, setSoilTypeError] = useState([]);

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
    formData.append("soil_type", soil_type);
    formData.append("zone", zone);
    formData.append("image", image);
  
    axiosInstance({
      method: "post",
      url: `/api/fields/`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        Notify.success("Field added successfully.");
        getFields();
        setName("");
        setAddress("");
        setLatitude("");
        setLongitude("");
        setDescription("");
        setType("");
        setIs_active(false);
        setZone("");
        setCityId("");
        setSoil_type("");
        setImage(null);
      })
      .catch((error) => {
        console.log(error);
        const errors = error.response.data;
        setNameError(errors.name);
        setAddressError(errors.address);
        setDescriptionError(errors.description);
        setSoilTypeError(errors.soil_type);
        setZoneError(errors.zone);
        setTypeError(errors.type);
        Notify.failure("Failed to add field.");
      });
  };
  

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setCityId(cityId);
    axiosInstance.get(`/api/zones/city=${cityId}`).then((response) => {
      setZones(response.data);
    });
  };

  const handleShowMapChange = (e) => {
    setShowMap(e.target.checked);
  };
  const handleCoordsSelected = (coords) => {
    setLatitude(coords[0]);
    setLongitude(coords[1]);
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl"
           centered>
      <Modal.Header closeButton>
        <Modal.Title>Add a new field</Modal.Title>
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
              required
              disabled
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLongitude">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="number"
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              required
              disabled
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

          <Form.Group controlId="formState">
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
              value={zone}
              onChange={(event) => setZone(event.target.value)}
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
              {fieldTypes &&
                fieldTypes.map((fieldType) => (
                  <option key={fieldType.id} value={fieldType.id}>
                    {fieldType.name}
                  </option>
                ))}
            </Form.Select>
            <div className="text-danger">{typeError}</div>
          </Form.Group>

          <Form.Group controlId="formSoilType">
            <Form.Label>Soil Type</Form.Label>
            <Form.Control
              as="select"
              value={soil_type}
              onChange={(event) => setSoil_type(event.target.value)}
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
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
            </Col>
          </Row>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary"  type="submit" form="myForm">
          Add Field
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        {showMap && (
          <Modal
            size="lg"
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
              <Map onSelect={handleCoordsSelected} center={currentLocation} />
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
export default AddFieldForm;
