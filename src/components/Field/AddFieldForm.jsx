import React, { useState,useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../../axiosInstance.js";

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

function AddFieldForm({ onAddField ,fieldTypes, show,cities,handleClose }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [is_active, setIs_active] = useState(false);
  const [soilType, setSoilType] = useState("");
  const [zone, setZone] = useState("");
  const [cityId, setCityId] = useState("");
  const [zones, setZones] = useState([]);
  
  const [nameError, setNameError] = useState([]);
  const [addressError, setAddressError] = useState([]);
  const [descriptionError, setDescriptionError] = useState([]);
  const [zoneError, setZoneError] = useState([]);
  const [typeError, setTypeError] = useState([]);
  const [soilTypeError, setSoilTypeError] = useState([]);



  const handleSubmit = (event) => {
    event.preventDefault();
    const field = {
      name: name,
      address: address,
      latitude: latitude,
      longitude: longitude,
      description: description,
      type: type,
      is_active: is_active,
      zone: zone,
      soil_type: soilType,
    };

    console.log(field);
    axiosInstance({
      method: 'post',
      url: `/api/fields/`,
      data: field,
    })
      .then((response) => {
        console.log(response);
        Notify.success("Field added successfully.");
        // Reset the form fields
         // Call the onAddField callback function to refresh the list of fields
        onAddField(field);
        setName("");
        setAddress("");
        setLatitude("");
        setLongitude("");
        setDescription("");
        setType("");
        setIs_active(false);
        setZone("");
        setCityId('');
        setSoilType("");

        
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
        Notify.failure("Failed to add field.");
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
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a new field</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group controlId="formState">
            <Form.Check
              type="checkbox"
              label="is_active"
              checked={is_active}
              onChange={(event) => setIs_active(event.target.checked)}
            />
          </Form.Group>


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
          <Button variant="primary" type="submit">
            Add Field
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AddFieldForm;
