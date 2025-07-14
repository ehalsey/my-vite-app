import React, { useState } from 'react';
import { appointments, resources } from './events';

const DoctorCalendar = () => {
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('2025-07-13');
  const [endDate, setEndDate] = useState('2025-07-16');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // Generate dates based on selected date range
  const generateDates = () => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      dates.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        })
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Get visible dates based on toggle state
  const getVisibleDates = () => {
    if (showAllProviders) {
      return dates.slice(0, 2); // Show 2 days when showing all providers (to fit screen)
    } else {
      return dates.slice(currentDateIndex, currentDateIndex + 2); // Show 2 days
    }
  };

  // Get visible resources based on selection
  const getVisibleResources = () => {
    if (selectedDoctors.length > 0) {
      // Show only selected doctors
      return resources.filter(r => selectedDoctors.includes(r.id));
    } else if (showAllProviders) {
      return resources.slice(0, 6); // Show first 6 providers when showing all
    } else {
      return resources.slice(currentResourceIndex, currentResourceIndex + 2);
    }
  };

  // Handle doctor selection
  const handleDoctorToggle = (doctorId: string) => {
    setSelectedDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  const handleSelectAllDoctors = () => {
    if (selectedDoctors.length === resources.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(resources.map(r => r.id));
    }
  };

  const handleDateRangePreset = (preset: 'today' | 'week' | 'month') => {
    const today = new Date();
    let start, end;
    
    switch (preset) {
      case 'today':
        start = end = today.toISOString().split('T')[0];
        break;
      case 'week':
        start = today.toISOString().split('T')[0];
        end = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      default:
        return;
    }
    
    setStartDate(start);
    setEndDate(end);
  };

  const scrollDatesLeft = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
    }
  };

  const scrollDatesRight = () => {
    if (currentDateIndex < dates.length - 2) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  const scrollResourcesLeft = () => {
    if (currentResourceIndex > 0) {
      setCurrentResourceIndex(currentResourceIndex - 1);
    }
  };

  const scrollResourcesRight = () => {
    if (currentResourceIndex < resources.length - 2) {
      setCurrentResourceIndex(currentResourceIndex + 1);
    }
  };

  // Generate time slots from 7 AM to 6 PM
  const timeSlots: string[] = [];
  for (let hour = 7; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const getAppointmentsForResourceAndDate = (resourceId: string, dateString: string) => {
    return appointments.filter(apt => 
      apt.resourceId === resourceId && 
      apt.start.startsWith(dateString)
    );
  };

  interface Appointment {
    id: string;
    resourceId: string;
    start: string;
    end: string;
    patient: string;
    type: string;
  }

  const getAppointmentStyle = (appointment: Appointment): React.CSSProperties => {
    const startTime = new Date(appointment.start);
    const endTime = new Date(appointment.end);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    // Calculate position (7 AM = 0, each hour = 120px, each 30min = 60px)
    const startPosition = (startHour - 7) * 120 + (startMinute / 30) * 60;
    const endPosition = (endHour - 7) * 120 + (endMinute / 30) * 60;
    const height = endPosition - startPosition;

    const resource = resources.find(r => r.id === appointment.resourceId);

    return {
      position: 'absolute' as const,
      top: `${startPosition}px`,
      height: `${height}px`,
      left: '4px',
      right: '4px',
      backgroundColor: resource?.color || '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      overflow: 'hidden',
      zIndex: 5
    };
  };

  const visibleDates = getVisibleDates();
  const visibleResources = getVisibleResources();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Multi-Day Doctor Schedule</h1>
        
        {/* Filter Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Doctor Selection */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Select Doctors</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                  className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-sm text-gray-700">
                    {selectedDoctors.length === 0 
                      ? 'All Doctors' 
                      : `${selectedDoctors.length} Doctor${selectedDoctors.length > 1 ? 's' : ''} Selected`
                    }
                  </span>
                  <svg className={`w-4 h-4 transform transition-transform ${showDoctorDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleSelectAllDoctors}
                  className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {selectedDoctors.length === resources.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              
              {showDoctorDropdown && (
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white">
                  {resources.map(doctor => (
                    <label
                      key={doctor.id}
                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDoctors.includes(doctor.id)}
                        onChange={() => handleDoctorToggle(doctor.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: doctor.color }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doctor.title}</div>
                          <div className="text-xs text-gray-500">{doctor.specialty}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Select Date Range</h3>
            <div className="space-y-3">
              {/* Quick Presets */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDateRangePreset('today')}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Today
                </button>
                <button
                  onClick={() => handleDateRangePreset('week')}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  This Week
                </button>
                <button
                  onClick={() => handleDateRangePreset('month')}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  This Month
                </button>
              </div>
              
              {/* Custom Date Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {dates.length} day{dates.length > 1 ? 's' : ''}: {dates[0]?.displayDate} 
                {dates.length > 1 && ` - ${dates[dates.length - 1]?.displayDate}`}
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* View Toggle */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Navigation Mode:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={showAllProviders}
                    onChange={(e) => setShowAllProviders(e.target.checked)}
                    disabled={selectedDoctors.length > 0}
                  />
                  <div className={`w-14 h-7 rounded-full transition-colors ${
                    selectedDoctors.length > 0 ? 'bg-gray-300' : showAllProviders ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showAllProviders && selectedDoctors.length === 0 ? 'translate-x-8' : 'translate-x-1'
                    } mt-1`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {selectedDoctors.length > 0 
                      ? 'Custom Selection' 
                      : showAllProviders 
                        ? 'Show Multiple' 
                        : 'Navigate Mode'
                    }
                  </span>
                </label>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {visibleResources.length} provider{visibleResources.length > 1 ? 's' : ''} • {visibleDates.length} day{visibleDates.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Navigation Controls */}
          {!showAllProviders && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Dates:</span>
                <button
                  onClick={scrollDatesLeft}
                  disabled={currentDateIndex === 0}
                  className={`px-3 py-1 rounded text-sm ${
                    currentDateIndex === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  ← Dates
                </button>
                <span className="text-sm text-gray-600">
                  {visibleDates.map(d => d.displayDate).join(' • ')}
                </span>
                <button
                  onClick={scrollDatesRight}
                  disabled={currentDateIndex >= dates.length - 2}
                  className={`px-3 py-1 rounded text-sm ${
                    currentDateIndex >= dates.length - 2
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Dates →
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Providers:</span>
                <button
                  onClick={scrollResourcesLeft}
                  disabled={currentResourceIndex === 0}
                  className={`px-3 py-1 rounded text-sm ${
                    currentResourceIndex === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  ← Providers
                </button>
                <span className="text-sm text-gray-600">
                  {visibleResources.map(r => r.title).join(' • ')}
                </span>
                <button
                  onClick={scrollResourcesRight}
                  disabled={currentResourceIndex >= resources.length - 2}
                  className={`px-3 py-1 rounded text-sm ${
                    currentResourceIndex >= resources.length - 2
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Providers →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`${showAllProviders ? 'overflow-x-auto' : ''}`}>
            {/* Date Headers */}
            <div className="flex border-b-2 border-gray-300" style={{ 
              minWidth: showAllProviders ? `${visibleDates.length * visibleResources.length * 200 + 80}px` : 'auto' 
            }}>
              <div className="w-20 bg-gray-100 border-r-2 border-gray-300 p-3 flex-shrink-0 sticky left-0 z-20">
                <div className="text-sm font-bold text-gray-700">Time</div>
              </div>
              {visibleDates.map(dateInfo => (
                <div 
                  key={dateInfo.dateString} 
                  className="bg-gray-100 p-3 text-center border-r-2 border-gray-300 last:border-r-0"
                  style={{ 
                    width: showAllProviders ? `${visibleResources.length * 192}px` : `${100 / visibleDates.length}%`
                  }}
                >
                  <div className="text-sm font-bold text-gray-800">{dateInfo.displayDate}</div>
                  <div className="text-xs text-gray-600 mt-1">{dateInfo.fullDate}</div>
                </div>
              ))}
            </div>

            {/* Provider Sub-headers */}
            <div className="flex border-b border-gray-200" style={{ 
              minWidth: showAllProviders ? `${visibleDates.length * visibleResources.length * 200 + 80}px` : 'auto' 
            }}>
              <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0 sticky left-0 z-20"></div>
              {visibleDates.map(dateInfo => (
                <div 
                  key={`${dateInfo.dateString}-providers`} 
                  className="flex border-r border-gray-200 last:border-r-0"
                  style={{ 
                    width: showAllProviders ? `${visibleResources.length * 192}px` : `${100 / visibleDates.length}%`
                  }}
                >
                  {visibleResources.map(resource => (
                    <div
                      key={`${dateInfo.dateString}-${resource.id}`}
                      className="p-2 text-center border-r border-gray-200 last:border-r-0"
                      style={{ 
                        backgroundColor: `${resource.color}15`,
                        width: showAllProviders ? '192px' : `${100 / visibleResources.length}%`
                      }}
                    >
                      <div 
                        className="text-xs font-medium"
                        style={{ color: resource.color }}
                      >
                        {resource.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{resource.specialty}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex" style={{ 
              minWidth: showAllProviders ? `${visibleDates.length * visibleResources.length * 200 + 80}px` : 'auto' 
            }}>
              {/* Time Column */}
              <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0 sticky left-0 z-10">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className={`h-15 px-2 py-1 text-xs text-gray-600 border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                    style={{ height: '60px' }}
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Date and Resource Columns */}
              {visibleDates.map(dateInfo => (
                <div 
                  key={`${dateInfo.dateString}-grid`} 
                  className="flex border-r border-gray-200 last:border-r-0"
                  style={{ 
                    width: showAllProviders ? `${visibleResources.length * 192}px` : `${100 / visibleDates.length}%`
                  }}
                >
                  {visibleResources.map(resource => (
                    <div
                      key={`${dateInfo.dateString}-${resource.id}-grid`}
                      className="border-r border-gray-200 last:border-r-0 relative"
                      style={{ 
                        width: showAllProviders ? '192px' : `${100 / visibleResources.length}%`
                      }}
                    >
                      {/* Time Grid Background */}
                      {timeSlots.map((time, index) => (
                        <div
                          key={time}
                          className={`h-15 border-b border-gray-100 ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          }`}
                          style={{ height: '60px' }}
                        />
                      ))}
                      
                      {/* Appointments */}
                      {getAppointmentsForResourceAndDate(resource.id, dateInfo.dateString).map(appointment => (
                        <div
                          key={appointment.id}
                          style={getAppointmentStyle(appointment)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          title={`${appointment.patient}\n${appointment.type}\n${new Date(appointment.start).toLocaleTimeString()} - ${new Date(appointment.end).toLocaleTimeString()}`}
                        >
                          <div className="font-medium text-xs leading-tight">
                            {appointment.patient}
                          </div>
                          <div className="text-xs opacity-90 mt-1">
                            {appointment.type}
                          </div>
                          <div className="text-xs opacity-80 mt-1">
                            {new Date(appointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visible Schedule Summary */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Current View</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Dates:</strong> {visibleDates.map(d => d.displayDate).join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Providers:</strong> {visibleResources.map(r => r.title).join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Total Appointments:</strong> {
                  visibleDates.reduce((total, dateInfo) => {
                    return total + visibleResources.reduce((dateTotal, resource) => {
                      return dateTotal + getAppointmentsForResourceAndDate(resource.id, dateInfo.dateString).length;
                    }, 0);
                  }, 0)
                }
              </div>
            </div>
          </div>

          {/* All Providers Legend */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">All Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {resources.map(resource => (
                <div
                  key={resource.id}
                  className="flex items-center space-x-2 p-2 rounded-lg"
                  style={{ backgroundColor: `${resource.color}15` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: resource.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">{resource.title}</div>
                    <div className="text-xs text-gray-500">{resource.specialty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCalendar;