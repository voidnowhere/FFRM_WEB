import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the CSS file for react-calendar
function ReservationCalendar({ onDateChange }) {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (newDate) => {
        setDate(newDate);
        onDateChange(newDate);
    };

    return (
        <div>
            <Calendar
                value={date}
                onChange={handleDateChange}
            />
        </div>
    );
}
export default ReservationCalendar;