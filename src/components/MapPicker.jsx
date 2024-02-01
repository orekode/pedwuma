import { useState, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete } from '@react-google-maps/api';

// eslint-disable-next-line react/prop-types
export default function ({ onSelectLocation, lat = 0, lng = 0, showInput=true }) {

    const [center, setCenter] = useState({ lat: parseFloat(lat), lng: parseFloat(lng) });

    const autocompleteRef = useRef(null);

    const handleMapClick = (event) => {
        setCenter({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        });

        let address = '';

        // Reverse geocoding to get location in words
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: center }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
            const formattedAddress = results[0].formatted_address;
            address = formattedAddress;
            // console.log("I got the address", address);
            onSelectLocation({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                address: address, // Replace with actual location
            });
            }
        }
        });


        
    };

    const onPlaceSelected = () => {
        const place = autocompleteRef.current.getPlace();

        if (place.geometry) {
        const selectedAddress = place.formatted_address;
        setCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        });

        onSelectLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: selectedAddress,
        });
        }
    };

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
        {showInput &&
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={onPlaceSelected}
                >
                    <input
                        className={`w-full h-full p-2 px-5 ring-0 hover:border-green-400 hover:ring-0 outline-none min-h-[60px] search-box bg-white border-2 border-green-400 rounded-md shadow-lg mb-5`}
                        type="text"
                        placeholder="Enter an address"
                    />
                </Autocomplete>
        }
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={center}
            zoom={16}
            option={{mapTypeId: 'satellite'}}
            onClick={handleMapClick}
        >
            <MarkerF
                position={{ lat: center.lat, lng: center.lng }}
            />
        </GoogleMap>
        </>
    );
    else return "Loading..."
}