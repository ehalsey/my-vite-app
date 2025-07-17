import React, { useState, type CSSProperties } from 'react';
import {
  type MultiResourceCalendarProps,
  type CalendarResource,
  type CalendarEvent,
  type DateInfo,
  type CalendarState,
  isValidTimeSlot,
  isValidEvent,
  isValidResource,
} from '../types/calendarTypes';

const MultiResourceCalendar: React.FC<MultiResourceCalendarProps> = ({
  resources = [],
  events = [],
  startDate = new Date().toISOString().split('T')[0],
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  timeSlots = { start: 7, end: 18, interval: 30 },
  compactMode = false,
  showFilters = false,
  maxHeight = 96,
  columnWidth = { comfortable: 200, compact: 150 },
  onEventClick = (event: CalendarEvent, _jsEvent: React.SyntheticEvent) => console.log('Event clicked:', event, _jsEvent),
  onEventDragStart = (event: CalendarEvent, _jsEvent: React.MouseEvent) => console.log('Drag start:', event, _jsEvent),
  onSlotClick = (date: string, time: string, resourceId: string, _jsEvent: React.SyntheticEvent) => console.log('Slot clicked:', date, time, resourceId, _jsEvent),
  onResourceClick = (resource: CalendarResource, _jsEvent: React.SyntheticEvent) => console.log('Resource clicked:', resource, _jsEvent),
  onDateClick = (dateInfo: DateInfo, _jsEvent: React.SyntheticEvent) => console.log('Date clicked:', dateInfo, _jsEvent),
  onResourceSelectionChange = () => {},
  eventStyler = (): CSSProperties => ({}),
  resourceStyler = (): CSSProperties => ({}),
  slotStyler = (): CSSProperties => ({}),
  eventRenderer = null,
  resourceRenderer = null,
  dateRenderer = null,
  selectedResources = [],
  className = '',
  style = {},
  locale = 'en-US',
  enableDragDrop = false,
  loading = false,
  error = null,
  ariaLabel = 'Multi-resource calendar',
  ariaDescribedBy,
}) => {
  const [state, setState] = useState<CalendarState>({
    showFiltersPanel: showFilters,
    selectedDoctors: selectedResources,
    internalStartDate: startDate,
    internalEndDate: endDate,
    showDoctorDropdown: false,
    draggedEvent: null,
    compactMode: compactMode,
  });

  // Validate props
  React.useEffect(() => {
    if (!isValidTimeSlot(timeSlots)) {
      console.error('Invalid timeSlots configuration');
    }
    
    events.forEach(event => {
      if (!isValidEvent(event)) {
        console.error('Invalid event:', event);
      }
    });
    
    resources.forEach(resource => {
      if (!isValidResource(resource)) {
        console.error('Invalid resource:', resource);
      }
    });
  }, [timeSlots, events, resources]);

  const generateDates = (): DateInfo[] => {
    const dates: DateInfo[] = [];
    const start = new Date(state.internalStartDate);
    const end = new Date(state.internalEndDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const localeCode = typeof locale === 'string' ? locale : locale.code;
      
      dates.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString(localeCode, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        fullDate: date.toLocaleDateString(localeCode, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      });
    }
    return dates;
  };

  const dates = generateDates();
  
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = timeSlots.start; hour < timeSlots.end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (timeSlots.interval === 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      } else if (timeSlots.interval === 15) {
        slots.push(`${hour.toString().padStart(2, '0')}:15`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
        slots.push(`${hour.toString().padStart(2, '0')}:45`);
      }
    }
    return slots;
  };

  const timeSlotList = generateTimeSlots();

  const getVisibleResources = (): CalendarResource[] => {
    if (state.selectedDoctors.length > 0) {
      return resources.filter((r: CalendarResource) => state.selectedDoctors.includes(r.id));
    }
    return resources;
  };

  const visibleResources = getVisibleResources();

  const getEventsForResourceAndDate = (resourceId: string, dateString: string): CalendarEvent[] => {
    return events.filter((event: CalendarEvent) => 
      event.resourceId === resourceId && 
      event.start.startsWith(dateString)
    );
  };

  const getEventStyle = (event: CalendarEvent): CSSProperties => {
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    
    const hourHeight = timeSlots.interval === 30 ? 120 : timeSlots.interval === 15 ? 240 : 60;
    const startPosition = (startHour - timeSlots.start) * hourHeight + (startMinute / 60) * hourHeight;
    const endPosition = (endHour - timeSlots.start) * hourHeight + (endMinute / 60) * hourHeight;
    const height = Math.max(endPosition - startPosition, 20);
    
    const resource = resources.find((r: CalendarResource) => r.id === event.resourceId);
    const customStyle = eventStyler(event);
    
    return {
      position: 'absolute',
      top: `${startPosition}px`,
      height: `${height}px`,
      left: '4px',
      right: '4px',
      backgroundColor: event.backgroundColor || customStyle.backgroundColor || resource?.color || '#3498db',
      color: event.textColor || customStyle.color || 'white',
      border: event.borderColor ? `1px solid ${event.borderColor}` : customStyle.border || 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      overflow: 'hidden',
      zIndex: 5,
      cursor: enableDragDrop ? 'move' : 'pointer',
      opacity: event.display === 'background' ? 0.3 : 1,
      ...customStyle,
    };
  };

  const handleEventClick = (event: CalendarEvent, e: React.SyntheticEvent) => {
    e.stopPropagation();
    onEventClick(event, e as React.MouseEvent);
  };

  const handleEventDragStart = (event: CalendarEvent, e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableDragDrop) return;
    setState((prev: CalendarState) => ({ ...prev, draggedEvent: event }));
    onEventDragStart(event, e);
  };

  const handleSlotClick = (date: string, time: string, resourceId: string, e: React.SyntheticEvent) => {
    onSlotClick(date, time, resourceId, e as React.MouseEvent);
  };

  const handleResourceClick = (resource: CalendarResource, e: React.SyntheticEvent) => {
    onResourceClick(resource, e as React.MouseEvent);
  };

  const handleDateClick = (dateInfo: DateInfo, e: React.SyntheticEvent) => {
    onDateClick(dateInfo, e as React.MouseEvent);
  };

  const handleResourceToggle = (resourceId: string): void => {
    const newSelection = state.selectedDoctors.includes(resourceId)
      ? state.selectedDoctors.filter((id: string) => id !== resourceId)
      : [...state.selectedDoctors, resourceId];
    
    setState((prev: CalendarState) => ({ ...prev, selectedDoctors: newSelection }));
    onResourceSelectionChange(newSelection);
  };

  const handleSelectAllResources = (): void => {
    const newSelection = state.selectedDoctors.length === resources.length ? [] : resources.map((r: CalendarResource) => r.id);
    setState((prev: CalendarState) => ({ ...prev, selectedDoctors: newSelection }));
    onResourceSelectionChange(newSelection);
  };

  const handleDateRangePreset = (preset: 'today' | 'week' | 'month'): void => {
    const today = new Date();
    let start: string, end: string;
    
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
    
    setState((prev: CalendarState) => ({
      ...prev,
      internalStartDate: start,
      internalEndDate: end,
    }));
  };

  const renderEvent = (event: CalendarEvent): React.ReactNode => {
    if (eventRenderer) {
      return eventRenderer(event);
    }
    
    const localeCode = typeof locale === 'string' ? locale : locale.code;
    const timeFormatOptions = typeof locale === 'string' 
      ? { hour: '2-digit', minute: '2-digit' } as const
      : locale.timeFormat;
    
    return (
      <div className="font-medium text-xs leading-tight">
        <div>{event.title}</div>
        <div className="text-xs opacity-90 mt-1">
          {new Date(event.start).toLocaleTimeString(localeCode, timeFormatOptions)}
        </div>
      </div>
    );
  };

  const renderResource = (resource: CalendarResource): React.ReactNode => {
    if (resourceRenderer) {
      return resourceRenderer(resource);
    }
    
    return (
      <>
        <div 
          className="text-xs font-medium"
          style={{ color: resource.color }}
        >
          {resource.title}
        </div>
        {resource.specialty && (
          <div className="text-xs text-gray-500 mt-1">{resource.specialty}</div>
        )}
      </>
    );
  };

  const renderDate = (dateInfo: DateInfo): React.ReactNode => {
    if (dateRenderer) {
      return dateRenderer(dateInfo);
    }
    
    return (
      <>
        <div className="text-sm font-bold text-gray-800">{dateInfo.displayDate}</div>
        <div className="text-xs text-gray-600 mt-1">{dateInfo.fullDate}</div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg" role="status" aria-label="Loading calendar">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg" role="alert">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const currentColumnWidth = state.compactMode ? columnWidth.compact : columnWidth.comfortable;

  return (
    <div 
      className={`p-6 bg-gray-50 min-h-screen ${className}`} 
      style={style}
      role="application"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Multi-Resource Calendar</h1>
          
          {resources.length > 0 && (
            <button
              onClick={() => setState((prev: CalendarState) => ({ ...prev, showFiltersPanel: !prev.showFiltersPanel }))}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              aria-expanded={state.showFiltersPanel}
              aria-controls="calendar-filters"
            >
              <svg 
                className={`w-4 h-4 transform transition-transform ${state.showFiltersPanel ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="text-sm font-medium">
                {state.showFiltersPanel ? 'Hide Filters' : 'Show Filters'}
              </span>
            </button>
          )}
        </div>
        
        {resources.length > 0 && (
          <div 
            id="calendar-filters"
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              state.showFiltersPanel ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Select Resources</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setState((prev: CalendarState) => ({ ...prev, showDoctorDropdown: !prev.showDoctorDropdown }))}
                      className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-expanded={state.showDoctorDropdown}
                      aria-haspopup="listbox"
                    >
                      <span className="text-sm text-gray-700">
                        {state.selectedDoctors.length === 0 
                          ? 'All Resources' 
                          : `${state.selectedDoctors.length} Resource${state.selectedDoctors.length > 1 ? 's' : ''} Selected`
                        }
                      </span>
                      <svg className={`w-4 h-4 transform transition-transform ${state.showDoctorDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleSelectAllResources}
                      className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {state.selectedDoctors.length === resources.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  
                  {state.showDoctorDropdown && (
                    <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white" role="listbox">
                      {resources.map(resource => (
                        <label
                          key={resource.id}
                          className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                          role="option"
                          aria-selected={state.selectedDoctors.includes(resource.id)}
                        >
                          <input
                            type="checkbox"
                            checked={state.selectedDoctors.includes(resource.id)}
                            onChange={() => handleResourceToggle(resource.id)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            aria-describedby={`resource-${resource.id}-description`}
                          />
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: resource.color }}
                              aria-hidden="true"
                            />
                            <div id={`resource-${resource.id}-description`}>
                              <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                              {resource.specialty && (
                                <div className="text-xs text-gray-500">{resource.specialty}</div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Select Date Range</h3>
                <div className="space-y-3">
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
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        id="start-date"
                        type="date"
                        value={state.internalStartDate}
                        onChange={(e) => setState((prev: CalendarState) => ({ ...prev, internalStartDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        id="end-date"
                        type="date"
                        value={state.internalEndDate}
                        onChange={(e) => setState((prev: CalendarState) => ({ ...prev, internalEndDate: e.target.value }))}
                        min={state.internalStartDate}
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
        )}

        <div className="bg-gray-100 p-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            <span>
              <strong>Viewing:</strong> {visibleResources.length} resource{visibleResources.length > 1 ? 's' : ''} • {dates.length} day{dates.length > 1 ? 's' : ''}
            </span>
            {state.selectedDoctors.length > 0 && (
              <span className="text-blue-600">
                <strong>Custom Selection:</strong> {state.selectedDoctors.length} resource{state.selectedDoctors.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">
              <input
                type="checkbox"
                checked={state.compactMode}
                onChange={(e) => setState((prev: CalendarState) => ({ ...prev, compactMode: e.target.checked }))}
                className="mr-2"
              />
              Compact Mode
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="overflow-x-auto overflow-y-auto" 
            style={{ maxHeight: `${maxHeight * 4}px` }}
            role="grid"
            aria-label="Calendar grid"
          >
            <div className="flex border-b-2 border-gray-300 sticky top-0 z-30 bg-white" style={{ 
              minWidth: `${dates.length * visibleResources.length * currentColumnWidth + 80}px`
            }}>
              <div className="w-20 bg-gray-100 border-r-2 border-gray-300 p-3 flex-shrink-0 sticky left-0 z-40">
                <div className="text-sm font-bold text-gray-700">Time</div>
              </div>
              {dates.map((dateInfo, dateIndex) => (
                <div 
                  key={`${dateInfo.dateString}-date-header`}
                  className="p-3 text-center border-r-2 border-gray-300 last:border-r-0 sticky z-35 cursor-pointer hover:bg-gray-200 transition-colors"
                  style={{ 
                    width: `${visibleResources.length * currentColumnWidth}px`,
                    left: '80px',
                    backgroundColor: dateIndex % 2 === 0 ? '#f3f4f6' : '#e5e7eb',
                  }}
                  onClick={(e) => handleDateClick(dateInfo, e)}
                  role="columnheader"
                  aria-label={`${dateInfo.fullDate} column`}
                >
                  {renderDate(dateInfo)}
                </div>
              ))}
            </div>

            <div className="flex border-b border-gray-200 sticky top-16 z-20 bg-white" style={{ 
              minWidth: `${dates.length * visibleResources.length * currentColumnWidth + 80}px`
            }}>
              <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0 sticky left-0 z-30"></div>
              {dates.map((dateInfo, dateIndex) => (
                visibleResources.map((resource, resourceIndex) => (
                  <div
                    key={`${dateInfo.dateString}-${resource.id}-provider-header`}
                    className="p-2 text-center border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-100 transition-colors"
                    style={{ 
                      backgroundColor: `${resource.color}15`,
                      width: `${currentColumnWidth}px`,
                      borderLeft: resourceIndex === 0 ? `3px solid ${dateIndex % 2 === 0 ? '#9ca3af' : '#6b7280'}` : 'none',
                      ...resourceStyler(resource),
                    }}
                    onClick={(e) => handleResourceClick(resource, e)}
                    role="columnheader"
                    aria-label={`${resource.title} for ${dateInfo.displayDate}`}
                  >
                    {renderResource(resource)}
                  </div>
                ))
              ))}
            </div>

            <div className="flex" style={{ 
              minWidth: `${dates.length * visibleResources.length * currentColumnWidth + 80}px`
            }}>
              <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0 sticky left-0 z-10" role="rowheader">
                {timeSlotList.map((time, index) => (
                  <div
                    key={time}
                    className={`h-15 px-2 py-1 text-xs text-gray-600 border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                    style={{ height: '60px' }}
                    role="rowheader"
                    aria-label={`${time} time slot`}
                  >
                    {time}
                  </div>
                ))}
              </div>

              {dates.map((dateInfo, dateIndex) => (
                visibleResources.map((resource, resourceIndex) => (
                  <div
                    key={`${dateInfo.dateString}-${resource.id}-grid`}
                    className="border-r border-gray-200 last:border-r-0 relative"
                    style={{ 
                      width: `${currentColumnWidth}px`,
                      borderLeft: resourceIndex === 0 ? `3px solid ${dateIndex % 2 === 0 ? '#9ca3af' : '#6b7280'}` : 'none',
                      ...slotStyler(dateInfo.dateString, null, resource),
                    }}
                    role="gridcell"
                    aria-label={`${resource.title} schedule for ${dateInfo.displayDate}`}
                  >
                    {timeSlotList.map((time, index) => (
                      <div
                        key={time}
                        className={`h-15 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                        style={{ height: '60px' }}
                        onClick={(e) => handleSlotClick(dateInfo.dateString, time, resource.id, e)}
                        role="button"
                        aria-label={`Create appointment at ${time} for ${resource.title} on ${dateInfo.displayDate}`}
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSlotClick(dateInfo.dateString, time, resource.id, e);
                          }
                        }}
                      >
                      </div>
                    ))}
                    
                    {getEventsForResourceAndDate(resource.id, dateInfo.dateString).map(event => (
                      <div
                        key={event.id}
                        style={getEventStyle(event)}
                        className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => handleEventClick(event, e)}
                        onMouseDown={(e) => handleEventDragStart(event, e)}
                        draggable={enableDragDrop}
                        title={event.title}
                        role="button"
                        aria-label={`Event: ${event.title} from ${new Date(event.start).toLocaleTimeString()} to ${new Date(event.end).toLocaleTimeString()}`}
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleEventClick(event, e);
                          }
                        }}
                      >
                        {renderEvent(event)}
                      </div>
                    ))}
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiResourceCalendar;