import React, { useRef, useState } from 'react';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../../../config/googleMapsApiKey';

const libraries = ['places'];

const CENTER = {
  lat: 32.34275660731343,
  lng: 34.91205864972199,
};

function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const AddressInput = ({ onAddressSelect }) => {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  // טעינת ספריית places
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address && place.geometry) {
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const distance = getDistanceFromLatLng(CENTER.lat, CENTER.lng, lat, lng);

      if (distance > 20) {
        setError('הכתובת שנבחרה מחוץ לרדיוס של 20 ק"מ מהמיקום המותר.');
      } else {
        setError('');
        const placeId = place.place_id;
        onAddressSelect({ address, lat, lng, placeId });
      }
    }
  };

  if (loadError) return <p>שגיאה בטעינת המפה</p>;
  if (!isLoaded) return <p>טוען את שירות הכתובות...</p>;

  return (
    <div>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your delivery address"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </Autocomplete>
      {error && (
        <p style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AddressInput;
