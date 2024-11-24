import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePickerComponent() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      {/* <h3>Select a Date</h3> */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd" // 원하는 날짜 형식 설정
        isClearable // 선택 해제 버튼 추가
        placeholderText="Click"
      />
      {/* {selectedDate && (
        <div>
          <p>Selected Date: {selectedDate.toDateString()}</p>
        </div>
      )} */}
    </div>
  );
}

export default DatePickerComponent;
