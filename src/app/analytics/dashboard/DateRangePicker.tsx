import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateRangePicker = ({ isOpen, onClose, onApply, initialStartDate, initialEndDate }) => {
  const [startDate, setStartDate] = useState(initialStartDate || new Date());
  const [endDate, setEndDate] = useState(initialEndDate || new Date());
  const [currentStartMonth, setCurrentStartMonth] = useState(new Date(startDate));
  const [currentEndMonth, setCurrentEndMonth] = useState(new Date(endDate));
  const [selecting, setSelecting] = useState('start'); // 'start' or 'end'
  const [inputStartDate, setInputStartDate] = useState(formatDateForInput(startDate));
  const [inputEndDate, setInputEndDate] = useState(formatDateForInput(endDate));
  
  const popoverRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  function formatDateForInput(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  function parseInputDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }
  
  function handlePrevMonth(isStartCalendar) {
    if (isStartCalendar) {
      const prevMonth = new Date(currentStartMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setCurrentStartMonth(prevMonth);
    } else {
      const prevMonth = new Date(currentEndMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setCurrentEndMonth(prevMonth);
    }
  }
  
  function handleNextMonth(isStartCalendar) {
    if (isStartCalendar) {
      const nextMonth = new Date(currentStartMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentStartMonth(nextMonth);
    } else {
      const nextMonth = new Date(currentEndMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentEndMonth(nextMonth);
    }
  }
  
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }
  
  function handleDayClick(date, isStartCalendar) {
    const newDate = new Date(
      isStartCalendar ? currentStartMonth.getFullYear() : currentEndMonth.getFullYear(),
      isStartCalendar ? currentStartMonth.getMonth() : currentEndMonth.getMonth(),
      date
    );
    
    if (selecting === 'start') {
      setStartDate(newDate);
      setInputStartDate(formatDateForInput(newDate));
      setSelecting('end');
    } else {
      setEndDate(newDate);
      setInputEndDate(formatDateForInput(newDate));
      setSelecting('start');
    }
  }
  
  function handleInputChange(event, isStart) {
    if (isStart) {
      setInputStartDate(event.target.value);
    } else {
      setInputEndDate(event.target.value);
    }
  }
  
  function handleKeyDown(event, isStart) {
    if (event.key === 'Enter') {
      try {
        const parsedDate = parseInputDate(isStart ? inputStartDate : inputEndDate);
        if (!isNaN(parsedDate.getTime())) {
          if (isStart) {
            setStartDate(parsedDate);
            setCurrentStartMonth(new Date(parsedDate));
          } else {
            setEndDate(parsedDate);
            setCurrentEndMonth(new Date(parsedDate));
          }
        }
      } catch (error) {
        console.error('Invalid date format');
      }
    }
  }
  
  function handleDone() {
    onApply(startDate, endDate);
    onClose();
  }
  
  function renderCalendar(isStartCalendar) {
    const currentDate = isStartCalendar ? currentStartMonth : currentEndMonth;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isStartSelected = date.toDateString() === startDate.toDateString();
      const isEndSelected = date.toDateString() === endDate.toDateString();
      const isInRange = date >= startDate && date <= endDate;
      
      days.push(
        <div 
          key={`day-${day}`}
          onClick={() => handleDayClick(day, isStartCalendar)}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full cursor-pointer
            ${isStartSelected || isEndSelected ? 'bg-teal-600 text-white' : 
              isInRange ? 'bg-teal-100' : 'hover:bg-gray-100'}
            text-center text-sm
          `}
        >
          {day}
        </div>
      );
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return (
      <div className="calendar">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => handlePrevMonth(isStartCalendar)} className="p-1">
            <ChevronLeft size={16} />
          </button>
          <span className="font-medium">
            {monthNames[month]} {year}
          </span>
          <button onClick={() => handleNextMonth(isStartCalendar)} className="p-1">
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">S</div>
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">M</div>
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">T</div>
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">W</div>
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">T</div>
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">F</div>
          <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500">S</div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-20">
      <div ref={popoverRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2">
            <h3 className="font-medium mb-4">Start</h3>
            <input
              type="text"
              value={inputStartDate}
              onChange={(e) => handleInputChange(e, true)}
              onKeyDown={(e) => handleKeyDown(e, true)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            {renderCalendar(true)}
          </div>
          
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <h3 className="font-medium mb-4">End</h3>
            <input
              type="text"
              value={inputEndDate}
              onChange={(e) => handleInputChange(e, false)}
              onKeyDown={(e) => handleKeyDown(e, false)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            {renderCalendar(false)}
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 bg-teal-600 text-white rounded"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;