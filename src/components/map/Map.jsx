import { LoadScript } from "@react-google-maps/api";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import React, { useState, useCallback } from "react";

const mapStyle = {
  width: "95%",
  height: "95%",
};

function Map({ location, locationName }) {
  setTimeout(() => {
    // alert();
    setZoomx(12);
  }, 1500);
  //console.log("locatoin name ", location);
  const [libraries] = useState(["places"]);
  const [zoomx, setZoomx] = useState(4);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDYUVOVS2fuO6dIFZLk0TA3SL1PEIikwUw",
    libraries,
  });
  const [map, setMap] = useState(null);
  const [show, setShow] = useState(false);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(location);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);
  //alert(loadError);
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyle}
      center={location}
      zoom={zoomx}
      options={{
        controlSize: false,
        panControl: false,
        fullscreenControl: false,
        zoomControl: false,
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={location} onClick={() => setShow(true)}>
        {show && locationName != "" && (
          <InfoWindow
            position={location}
            clickable={true}
            onCloseClick={() => setShow(false)}
          >
            <p>{locationName}</p>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map);
