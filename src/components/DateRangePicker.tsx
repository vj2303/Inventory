import { useState } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
}

export default function DateRangePicker({ 
  startDate, 
  endDate, 
  onDateRangeChange 
}: DateRangePickerProps) {
  const [month, setMonth] = useState('December');
  const [year, setYear] = useState(2024);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const daysInMonth = 31; // Simplified for December
  const firstDayOfMonth = 0; // Sunday for Dec 1st 2024

  const generateCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="p-2"></td>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = day === 3; // Highlight Dec 3rd
      days.push(
        <td key={day} className="p-2 text-center">
          <button
            className={`w-8 h-8 rounded-full ${
              isCurrentDay ? 'bg-teal-500 text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </button>
        </td>
      );
      
      // Start a new row if it's the end of the week
      if ((firstDayOfMonth + day) % 7 === 0) {
        days.push(<tr key={`row-${day}`}></tr>);
      }
    }
    
    return days;
  };

  const handleDayClick = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : day.toString();
    const formattedDate = `${formattedDay}/12/2024`;
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start a new range
      setTempStartDate(formattedDate);
      setTempEndDate('');
    } else {
      // Complete the range
      setTempEndDate(formattedDate);
    }
  };

  const handlePrevMonth = () => {
    console.log('Previous month clicked');
  };

  const handleNextMonth = () => {
    console.log('Next month clicked');
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeChange(tempStartDate, tempEndDate);
    }
  };

  return (
    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg z-10 border">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} className="text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h3 className="text-lg font-medium">{month}</h3>
          <button onClick={handleNextMonth} className="text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-center text-xs font-medium text-gray-500">SUN</th>
              <th className="p-2 text-center text-xs font-medium text-gray-500">MON</th>
              <th className="p-2 text-center text-xs font-medium text-gray-500">TUE</th>
              <th className="p-2 text-center text-xs font-medium text-gray-500">WED</th>
              <th className="p-2 text-center text-xs font-medium text-gray-500">THU</th>
              <th className="p-2 text-center text-xs font-medium text-gray-500">FRI</th>
              <th className="p-2 text-center text-xs font-medium text-gray-500">SAT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {generateCalendarDays()}
            </tr>
          </tbody>
        </table>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Start</p>
            <input
              type="text"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              className="mt-1 p-1 border rounded text-sm w-28"
            />
          </div>
          <div className="mx-2">-</div>
          <div>
            <p className="text-xs font-medium text-gray-500">End</p>
            <input
              type="text"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              className="mt-1 p-1 border rounded text-sm w-28"
            />
          </div>
        </div>
      </div>
    </div>
  );
}