import React, { useState } from 'react';

export interface Resource {
  id: string;
  title: string;
  color: string;
  specialty: string;
}

export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  patient: string;
  type: string;
}

interface DoctorCalendarProps {
  resources: Resource[];
  appointments: Appointment[];
  initialStartDate?: string;
  initialEndDate?: string;
}

const GrokDoc: React.FC<DoctorCalendarProps> = ({
  resources,
  appointments,
  initialStartDate = new Date().toISOString().split('T')[0],
  initialEndDate = new Date().toISOString().split('T')[0],
}) => {
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

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

  // Get visible dates - show all dates in the selected range
  const getVisibleDates = () => {
    return dates; // Always show all dates in the selected range
  };

  // Get visible resources - show all selected or all resources
  const getVisibleResources = () => {
    if (selectedDoctors.length > 0) {
      // Show only selected doctors
      return resources.filter(r => selectedDoctors.includes(r.id));
    } else {
      // Show all doctors when no specific selection
      return resources;
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
  const timeSlots = [];
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

  const getAppointmentStyle = (appointment: Appointment) => {
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Multi-Day Doctor Schedule</h1>
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transform transition-transform ${showFiltersPanel ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-sm font-medium">
              {showFiltersPanel ? 'Hide Filters' : 'Show Filters'}
            </span>
          </button>
        </div>
        
        {/* Collapsible Filter Controls */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showFiltersPanel ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>

        {/* Quick Summary Bar */}
        <div className="bg-gray-100 p-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            <span>
              <strong>Viewing:</strong> {visibleResources.length} provider{visibleResources.length > 1 ? 's' : ''} • {dates.length} day{dates.length > 1 ? 's' : ''}
            </span>
            {selectedDoctors.length > 0 && (
              <span className="text-blue-600">
                <strong>Custom Selection:</strong> {selectedDoctors.length} doctor{selectedDoctors.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedDoctors([]);
              setStartDate(initialStartDate);
              setEndDate(initialEndDate);
              setShowAllProviders(false);
            }}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset All
          </button>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* View Toggle - Now for display density */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Display Density:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={showAllProviders}
                    onChange={(e) => setShowAllProviders(e.target.checked)}
                  />
                  <div className={`w-14 h-7 rounded-full transition-colors ${
                    showAllProviders ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showAllProviders ? 'translate-x-8' : 'translate-x-1'
                    } mt-1`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {showAllProviders ? 'Compact View' : 'Comfortable View'}
                  </span>
                </label>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {visibleResources.length} provider{visibleResources.length > 1 ? 's' : ''} • {visibleDates.length} day{visibleDates.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            {/* Date Headers Row */}
            <div className="flex border-b-2 border-gray-300 sticky top-0 z-30 bg-white" style={{ 
              minWidth: `${visibleDates.length * visibleResources.length * (showAllProviders ? 150 : 200) + 80}px`
            }}>
              <div className="w-20 bg-gray-100 border-r-2 border-gray-300 p-3 flex-shrink-0 sticky left-0 z-40">
                <div className="text-sm font-bold text-gray-700">Time</div>
              </div>
              {visibleDates.map((dateInfo, dateIndex) => (
                <div 
                  key={`${dateInfo.dateString}-date-header`}
                  className="p-3 text-center border-r-2 border-gray-300 last:border-r-0 sticky z-35"
                  style={{ 
                    width: `${visibleResources.length * (showAllProviders ? 150 : 200)}px`,
                    left: '80px',
                    backgroundColor: dateIndex % 2 === 0 ? '#f3f4f6' : '#e5e7eb' // Alternating gray shades
                  }}
                >
                  <div className="text-sm font-bold text-gray-800">{dateInfo.displayDate}</div>
                  <div className="text-xs text-gray-600 mt-1">{dateInfo.fullDate}</div>
                </div>
              ))}
            </div>

            {/* Provider Headers Row */}
            <div className="flex border-b border-gray-200 sticky top-16 z-20 bg-white" style={{ 
              minWidth: `${visibleDates.length * visibleResources.length * (showAllProviders ? 150 : 200) + 80}px`
            }}>
              <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0 sticky left-0 z-30"></div>
              {visibleDates.map((dateInfo, dateIndex) => (
                visibleResources.map((resource, resourceIndex) => (
                  <div
                    key={`${dateInfo.dateString}-${resource.id}-provider-header`}
                    className="p-2 text-center border-r border-gray-200 last:border-r-0"
                    style={{ 
                      backgroundColor: `${resource.color}15`,
                      width: `${showAllProviders ? 150 : 200}px`,
                      // Add subtle border indicators for date groupings
                      borderLeft: resourceIndex === 0 ? `3px solid ${dateIndex % 2 === 0 ? '#9ca3af' : '#6b7280'}` : 'none'
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
                ))
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex" style={{ 
              minWidth: `${visibleDates.length * visibleResources.length * (showAllProviders ? 150 : 200) + 80}px`
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
              {visibleDates.map((dateInfo, dateIndex) => (
                visibleResources.map((resource, resourceIndex) => (
                  <div
                    key={`${dateInfo.dateString}-${resource.id}-grid`}
                    className="border-r border-gray-200 last:border-r-0 relative"
                    style={{ 
                      width: `${showAllProviders ? 150 : 200}px`,
                      // Add subtle border indicators for date groupings in the grid
                      borderLeft: resourceIndex === 0 ? `3px solid ${dateIndex % 2 === 0 ? '#9ca3af' : '#6b7280'}` : 'none'
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
                ))
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visible Schedule Summary */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Current View Summary</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Dates:</strong> {visibleDates.map(d => d.displayDate).join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Providers:</strong> {visibleResources.length > 3 
                  ? `${visibleResources.slice(0, 3).map(r => r.title).join(', ')} +${visibleResources.length - 3} more`
                  : visibleResources.map(r => r.title).join(', ')
                }
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

          {/* Quick Actions */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                  showFiltersPanel 
                    ? 'bg-gray-500 text-white hover:bg-gray-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {showFiltersPanel ? 'Hide Filters Panel' : 'Show Filters Panel'}
              </button>
              <button
                onClick={() => {
                  setSelectedDoctors(resources.slice(0, 5).map(r => r.id));
                  setShowFiltersPanel(true);
                }}
                className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Select First 5 Doctors
              </button>
              <button
                onClick={() => {
                  const surgeons = resources.filter(r => 
                    r.specialty.toLowerCase().includes('surgery') || 
                    r.specialty.toLowerCase().includes('surgeon')
                  );
                  setSelectedDoctors(surgeons.map(r => r.id));
                  setShowFiltersPanel(true);
                }}
                className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Show Only Surgeons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrokDoc;