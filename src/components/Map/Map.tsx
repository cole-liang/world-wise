import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useGeoContext } from "../../store/geo-context";
import { compareArray, countryCodeToUrl } from "../../util/helper";
import { useEffect, useState } from "react";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import Button from "../Button/Button";
import { useUrlLocation } from "../../hooks/useUrlLocation";

const defaultPosition: [number, number] = [40, 0];

function Map() {
  const navigate = useNavigate();
  const [mapPosition, setMapPosition] =
    useState<[number, number]>(defaultPosition);
  const { cities } = useGeoContext();
  const {
    isLoading: isGeoLocationLoading,
    geoLocation,
    getLocation,
  } = useGeoLocation();
  const { mapLat, mapLng } = useUrlLocation();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLocation) {
        setMapPosition(geoLocation);
        navigate(`form?lat=${geoLocation[0]}&lng=${geoLocation[1]}`);
      }
    },
    [geoLocation]
  );

  return (
    <div className={styles.mapContainer}>
      {!compareArray(geoLocation, mapPosition) && (
        <Button type="position" onClick={getLocation}>
          {isGeoLocationLoading ? "Loading..." : "Use your location"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          noWrap
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                <img src={countryCodeToUrl(city.countryCode)} />
              </span>
              {city.cityName}
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

type ChangeCenterProps = {
  position: [lat: number, lng: number];
};

function ChangeCenter({ position }: ChangeCenterProps) {
  const map = useMap();
  map.closePopup();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;
