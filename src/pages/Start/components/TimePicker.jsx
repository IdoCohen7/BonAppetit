import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { saveToSessionStorage, loadFromSessionStorage } from '../../Helpers/storageUtils';

const TimePickerMUI = () => {
  const [value, setValue] = useState(new Date());
  const [minTime, setMinTime] = useState(new Date());

  const formatToIsraelTime = (date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jerusalem',
    });
  };

  useEffect(() => {
    const savedTime = loadFromSessionStorage('chosenTime');
    const now = new Date();
    setMinTime(now);

    if (savedTime) {
      const [hours, minutes] = savedTime.split(':');
      const loadedDate = new Date();
      loadedDate.setHours(parseInt(hours));
      loadedDate.setMinutes(parseInt(minutes));

      if (loadedDate > now) {
        setValue(loadedDate);
      }
    }
  }, []);

  useEffect(() => {
    if (value) {
      const israelTime = formatToIsraelTime(value);
      saveToSessionStorage('chosenTime', israelTime);
      console.log('Saved time:', israelTime); // ✅ כאן מודפס הזמן שנשמר
    }
  }, [value]);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          label="choose time"
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
