import {MapContainer, Popup, TileLayer, useMapEvent} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Icon} from "leaflet/src/layer/marker";
import L from "leaflet";

import React, {useState, useRef} from "react";


const Map = ({onSelect, center}) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [coords, setCoords] = useState([31.958811120995733, -6.70597085900104]);


    const customIcon = new Icon({
        iconUrl: "/map.png",
        iconSize: [38, 38],
    });


    const handleMapClick = (e) => {
        const {latlng} = e;
        console.log(latlng);
        if (selectedMarker) {
            selectedMarker.setLatLng(latlng);
            setCoords([latlng.lat, latlng.lng]);
            onSelect([latlng.lat, latlng.lng]);

        } else {
            const marker = L.marker(latlng, {icon: customIcon}).addTo(map.current);
            setSelectedMarker(marker);
            setCoords([latlng.lat, latlng.lng]);
            onSelect([latlng.lat, latlng.lng]);
            console.log(coords);
        }

    };

    const map = useRef(null);


    return (

        <>

            <MapContainer style={{height: "400px", width: "750px"}} center={center || coords} zoom={5}
                          scrollWheelZoom={true} ref={map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedMarker && (
                    <Popup position={selectedMarker.getLatLng()}>My location</Popup>
                )}
                <MapClickHandler handleMapClick={handleMapClick}/>
            </MapContainer>

        </>

    );
};

const MapClickHandler = ({handleMapClick}) => {
    useMapEvent("click", handleMapClick);
    return null;
};

export default Map;
