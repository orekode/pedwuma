import { useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

// eslint-disable-next-line react/prop-types
export default function ({ lat = 0, lng = 0, }) {

    const [center, setCenter] = useState({ lat: parseFloat(lat), lng: parseFloat(lng) });

    const libraries = ['places'];

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBREjZAMtf-utlBXK1GTVkDdNNzYS3ZAiw',
        libraries: libraries,
    });

    console.log("center: " , lat, parseFloat(lat));

    useEffect( () => {
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }, [lat, lng]);

    if(isLoaded)
    return (
        <>
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={center}
            zoom={16}
            option={{mapTypeId: 'satellite'}}
        >
            <MarkerF
                position={{ lat: center.lat, lng: center.lng }}
            />
        </GoogleMap>
        </>
    );
    else return "Loading..."
}