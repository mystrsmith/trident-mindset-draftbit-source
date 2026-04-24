// This import is required if you are defining react components in this module.
import React, { useState, useEffect } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';

export const Index = ({ calData, onMonthChange, isLoading }) => {
  const [alldates, setAlldates] = useState({});
  useEffect(() => {
    setAlldates(calData);
  }, [calData]);
  return (
    <Calendar
      displayLoadingIndicator={isLoading}
      onMonthChange={onMonthChange}
      markedDates={alldates}
      style={{
        backgroundColor: 'transparent',
      }}
      hideExtraDays
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: '#b6c1cd',
        textSectionTitleDisabledColor: '#d9e1e8',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: 'white',
        todayTextColor: '#00adf5',
        dayTextColor: 'white',
        textDisabledColor: '#d9e1e8',
        dotColor: '#00adf5',
        arrowColor: 'white',
        disabledArrowColor: '#d9e1e8',
        monthTextColor: 'white',
        indicatorColor: 'white',
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 13,
      }}
    />
  );
};
