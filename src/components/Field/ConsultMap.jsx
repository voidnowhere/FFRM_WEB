import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Icon} from "leaflet/src/layer/marker";
import {useEffect, useState} from "react";

const FieldsOnMap = ({lat, long}) => {
    const position = [31.611530277838078, -8.047648552164675];
    const [popupVisible, setPopupVisible] = useState(false);
    const [mylat, setMylat] = useState(lat);
    const [mylong, setMylong] = useState(long);

    const userIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3382/3382279.png",
        iconSize: [50, 50],
    });

    const customIcon = new Icon({
        iconUrl: "/field.png",
        iconSize: [38, 38],
    });
    useEffect(() => {
        setMylat(lat);
        setMylong(long);
    }, []);

    return (
        <>
            <MapContainer
                style={{height: "450px", width: "450px"}}
                center={[mylat, mylong]}
                zoom={12}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    icon={customIcon}
                    position={[mylat, mylong]}
                >


                </Marker>

            </MapContainer>
        </>
    );
};
export default FieldsOnMap;
