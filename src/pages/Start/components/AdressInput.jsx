import React, { useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../../../config/googleMapsApiKey'; // Ensure you have your API key in this file

const libraries = ['places'];

const AddressInput = ({ onAddressSelect }) => {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address && place.geometry) {
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onAddressSelect({ address, lat, lng });
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="Enter your delivery address"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default AddressInput;