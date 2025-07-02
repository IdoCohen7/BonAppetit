import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { saveToSessionStorage, loadFromSessionStorage } from '../../Helpers/storageUtils';

const TimePickerMUI = () => {
  const [value, setValue] = useState(null);
  const [minTime, setMinTime] = useState(null);

  useEffect(() => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const savedTime = loadFromSessionStorage('chosenTime');
    setMinTime(now);

    if (savedTime) {
      const loaded = new Date(savedTime);
      if (!isNaN(loaded.getTime()) && loaded > now) {
        setValue(loaded);
      } else {
        setValue(now); // אם אין – בוחר עכשיו
      }
    } else {
      setValue(now); // ברירת מחדל
    }
  }, []);

  useEffect(() => {
    if (value) {
      saveToSessionStorage('chosenTime', value.toISOString());
    }
  }, [value]);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Choose time for courier departure"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          minTime={minTime}
          minutesStep={5}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TimePickerMUI;
