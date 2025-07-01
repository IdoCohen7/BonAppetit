import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { saveToSessionStorage, loadFromSessionStorage } from '../../Helpers/storageUtils';

const TimePickerMUI = () => {
  const [value, setValue] = useState(new Date());
  const [minTime, setMinTime] = useState(new Date());

  useEffect(() => {
    const savedTime = loadFromSessionStorage('chosenTime');
    const now = new Date();
    setMinTime(now);

    if (savedTime) {
      const loadedDate = new Date(savedTime);
      if (!isNaN(loadedDate.getTime()) && loadedDate > now) {
        setValue(loadedDate);
      }
    }
  }, []);

  useEffect(() => {
    if (value) {
      saveToSessionStorage('chosenTime', value.toISOString());
      console.log('Saved time:', value.toISOString());
    }
  }, [value]);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="Choose time"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          minTime={minTime}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TimePickerMUI;
