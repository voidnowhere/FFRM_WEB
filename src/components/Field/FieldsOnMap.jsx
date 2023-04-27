import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet/src/layer/marker";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../axiosInstance.js";
import Form from "react-bootstrap/Form";


const FieldsOnMap = () => {
  const position = [31.611530277838078, -8.047648552164675];
  const [currentLocation, setCurrentLocation] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [fields, setFields] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedField, setSelectedField] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    axiosInstance
      .get("api/fields/")
      .then((responsefields) => {
        setFields(responsefields.data);
        //console.log(responsefields.data);
        const markers = responsefields.data.map((field) => ({
          geocode: [field.latitude, field.longitude],
          field: field,
        }));
        setMarkers(markers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const userIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3382/3382279.png",
    iconSize: [50, 50],
  });

  const customIcon = new Icon({
    iconUrl: "/field.png",
    iconSize: [38, 38],
  });

  const handleMarkerClick = useCallback((field) => {
    setSelectedField(field);
    setPopupVisible(true);
  }, []);

  const MyPopup = ({ field, visible, onClose }) => {
    return (
      <>
        {field && visible && (
          <Popup onClose={onClose}>
            <Form>
              <Form.Label style={{ fontWeight: "bold" }}>Field:</Form.Label>
              {field.name}
              <br />
              <Form.Label style={{ fontWeight: "bold" }}>Address:</Form.Label>
              {field.address}
              <br />
              <Form.Label style={{ fontWeight: "bold" }}>Location:</Form.Label>[
              {field.latitude.toFixed(3)}, {field.longitude.toFixed(3)}]
              <br />
            </Form>
          </Popup>
        )}
      </>
    );
  };

  return (
    <>
      <MapContainer
        style={{ height: "600px", width: "1100px" }}
        center={position}
        zoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {markers.map((marker) => (
            <Marker
              key={marker.field.id}
              icon={customIcon}
              position={marker.geocode}
              eventHandlers={{
                click: () => handleMarkerClick(marker.field),
              }}
            >
              {selectedField && (
                <MyPopup
                  field={selectedField}
                  visible={popupVisible}
                  onClose={() => setPopupVisible(false)}
                />
              )}
            </Marker>
          ))}
        </MarkerClusterGroup>
        {currentLocation && (
          <Marker icon={userIcon} position={currentLocation}>
            <Popup>
              <h6> You are here </h6>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};
export default FieldsOnMap;
