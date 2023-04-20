import { Form, Button, Modal } from "react-bootstrap";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../axiosInstance.js";
import React, { useEffect, useState } from "react";
Notify.init({
  position: "center-top", // Notification position
  distance: "10px", // Distance between notifications
  opacity: 1, // Notification opacity
  borderRadius: "12px", // Border radius
  fontFamily: "inherit", // Font family
  fontSize: "16px", // Font size
  timeout: 3000,
});

function UpdateFieldForm({ showModal, onHide, field, cities,updateField }) {
  const [updatedField, setUpdatedField] = useState(field);
  const [id, setId] = useState(updatedField?.id);
  const [name, setName] = useState(updatedField?.name);
  const [address, setAddress] = useState(updatedField?.address);
  const [latitude, setLatitude] = useState(updatedField?.latitude);
  const [longitude, setLongitude] = useState(updatedField?.longitude);
  const [description, setDescription] = useState(updatedField?.description);
  const [field_type, setField_type] = useState(updatedField?.field_type);
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

  const [zoneId, setZoneId] = useState(updatedField?.zone);
  const [cityId, setCityId] = useState("");


  useEffect(() => {
    const fetchFieldTypes = async () => {
      const result = await axiosInstance.get("/api/fields/fieldtypes/");
      setField_types(result.data);
      // console.log(result.data);
    };
    fetchFieldTypes();
  }, []);

  
  useEffect(() => {
    const fetchFieldTypes = async () => {
      const result = await axiosInstance.get("/api/fields/zones/");
      setZones(result.data);
      // console.log(result.data);
    };
    fetchFieldTypes();
  }, []);
  
  useEffect(() => {
    const fetchCity = async () => {
      const result = await axiosInstance.get(`/api/fields/zones/${updatedField?.zone}/city`);
      setCityId(result.data.id);
      console.log(result.data);
    };
    fetchCity();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const field = {
      id: id,
      name: name,
      address: address,
      latitude: latitude,
      longitude: longitude,
      description: description,
      field_type: field_type,
      is_active: is_active,
      zone: zoneId,
      soil_type: soilType,
    };
    setUpdatedField(field);
    // console.log(field);
    axiosInstance({
      method: 'put',
      url: `/api/fields/${updatedField.id}/`,
      data: field,
    })
      .then((response) => {
        console.log(response);

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
        setTypeError(errors.field_type);
        Notify.failure("Failed to update field.");
      });
  };
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setCityId(cityId);
    axiosInstance.get(`/api/fields/zones/city=${cityId}`)
        .then((response) => {
            setZones(response.data);
        });
};

  return (
    <Modal show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Field</Modal.Title>
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

          <Form.Group controlId="formIs_active">
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
              value={field_type}
              onChange={(e) => setField_type(e.target.value)}
            >
              <option>--Select a type--</option>
              {field_types &&
                field_types.map((field_type) => (
                  <option key={field_type.id} value={field_type.id}>
                    {field_type.name}
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button type="submit" variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default UpdateFieldForm;
