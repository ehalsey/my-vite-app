import { useState, useRef, useEffect } from 'react';
import FullCalendar, { EventClickArg, DateSelectArg, ResourceLabelContentArg, DateClickArg, FullCalendarComponent } from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateTime } from 'luxon';

// Define interfaces for props and resources
interface Resource {
  id: string;
  title: string;
  specialty?: string;
  color?: string;
}

interface Event {
  id: string;
  resourceId: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
}

interface Props {
  resources?: Resource[];
  events?: Event[];
  initialStartDate?: string;
  initialEndDate?: string;
  timeSlots?: {
    start: string;
    end: string;
    interval: string;
  };
  onEventClick?: (info: EventClickArg) => void;
  onSlotSelect?: (info: DateSelectArg) => void;
  onResourceClick?: (info: ResourceLabelContentArg) => void;
  onDateClick?: (info: DateClickArg) => void;
}

const ResourceTimelineCalendar: React.FC<Props> = ({
  resources = [],
  events = [],
  initialStartDate = DateTime.now().toISODate(),
  initialEndDate = DateTime.now().plus({ days: 7 }).toISODate(),
  timeSlots = { start: '07:00', end: '18:00', interval: '00:30' },
  onEventClick = (info) => console.log('Event clicked:', info.event),
  onSlotSelect = (info) => console.log('Slot selected:', info),
  onResourceClick = (info) => console.log('Resource clicked:', info.resource),
  onDateClick = (info) => console.log('Date clicked:', info.dateStr),
}) => {
  const [calendarState, setCalendarState] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
    selectedResources: resources.map((r) => r.id),
    showFilters: false,
  });

  const calendarRef = useRef<FullCalendarComponent>(null);

  // Update calendar view when dates or resources change
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.setOption('datesSet', {
        start: DateTime.fromISO(calendarState.startDate).toJSDate(),
        end: DateTime.fromISO(calendarState.endDate).plus({ days: 1 }).toJSDate(),
      });
      calendarApi.setOption('resources', resources.filter((r) => calendarState.selectedResources.includes(r.id)));
    }
  }, [calendarState.startDate, calendarState.endDate, calendarState.selectedResources, resources]);

  // Handle resource toggle
  const handleResourceToggle = (resourceId: string) => {
    setCalendarState((prev) => ({
      ...prev,
      selectedResources: prev.selectedResources.includes(resourceId)
        ? prev.selectedResources.filter((id) => id !== resourceId)
        : [...prev.selectedResources, resourceId],
    }));
  };

  // Handle select all resources
  const handleSelectAllResources = () => {
    setCalendarState((prev) => ({
      ...prev,
      selectedResources: prev.selectedResources.length === resources.length
        ? []
        : resources.map((r) => r.id),
    }));
  };

  // Handle date range presets
  const handleDateRangePreset = (preset: 'today' | 'week' | 'month') => {
    const today = DateTime.now();
    let start: string, end: string;

    switch (preset) {
      case 'today':
        start = end = today.toISODate();
        break;
      case 'week':
        start = today.toISODate();
        end = today.plus({ days: 6 }).toISODate();
        break;
      case 'month':
        start = today.startOf('month').toISODate();
        end = today.endOf('month').toISODate();
        break;
      default:
        return;
    }

    setCalendarState((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" role="application" aria-label="Resource Timeline Calendar">
      <div className="max-w-full mx-auto">
        {/* Filter Component */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Resource Schedule</h1>
          <button
            onClick={() => setCalendarState((prev) => ({ ...prev, showFilters: !prev.showFilters }))}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            aria-expanded={calendarState.showFilters}
            aria-controls="calendar-filters"
          >
            <svg
              className={`w-4 h-4 transform transition-transform ${calendarState.showFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-sm font-medium">{calendarState.showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div
          id="calendar-filters"
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            calendarState.showFilters ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Filter */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Select Resources</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCalendarState((prev) => ({ ...prev, showFilters: !prev.showFilters }))}
                    className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-expanded={calendarState.showFilters}
                    aria-haspopup="listbox"
                  >
                    <span className="text-sm text-gray-700">
                      {calendarState.selectedResources.length === 0
                        ? 'All Resources'
                        : `${calendarState.selectedResources.length} Resource${
                            calendarState.selectedResources.length > 1 ? 's' : ''
                          } Selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${calendarState.showFilters ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSelectAllResources}
                    className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {calendarState.selectedResources.length === resources.length ? 'Clear All' : 'Select All'}
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white" role="listbox">
                  {resources.map((resource) => (
                    <label
                      key={resource.id}
                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                      role="option"
                      aria-selected={calendarState.selectedResources.includes(resource.id)}
                    >
                      <input
                        type="checkbox"
                        checked={calendarState.selectedResources.includes(resource.id)}
                        onChange={() => handleResourceToggle(resource.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        aria-describedby={`resource-${resource.id}-description`}
                      />
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: resource.color || '#3498db' }}
                          aria-hidden="true"
                        />
                        <div id={`resource-${resource.id}-description`}>
                          <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                          {resource.specialty && <div className="text-xs text-gray-500">{resource.specialty}</div>}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
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
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={calendarState.startDate}
                      onChange={(e) => setCalendarState((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      value={calendarState.endDate}
                      onChange={(e) => setCalendarState((prev) => ({ ...prev, endDate: e.target.value }))}
                      min={calendarState.startDate}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {DateTime.fromISO(calendarState.endDate).diff(DateTime.fromISO(calendarState.startDate), 'days').days + 1} day
                  {DateTime.fromISO(calendarState.endDate).diff(DateTime.fromISO(calendarState.startDate), 'days').days > 0 ? 's' : ''}: {DateTime.fromISO(calendarState.startDate).toLocaleString(DateTime.DATE_MED)}
                  {DateTime.fromISO(calendarState.endDate).diff(DateTime.fromISO(calendarState.startDate), 'days').days > 0 &&
                    ` - ${DateTime.fromISO(calendarState.endDate).toLocaleString(DateTime.DATE_MED)}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FullCalendar Component */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[resourceTimelinePlugin, timeGridPlugin, interactionPlugin, dayGridPlugin]}
            initialView="resourceTimeline"
            headerToolbar={false}
            resources={resources.filter((r) => calendarState.selectedResources.includes(r.id))}
            events={events}
            initialDate={calendarState.startDate}
            validRange={{
              start: calendarState.startDate,
              end: DateTime.fromISO(calendarState.endDate).plus({ days: 1 }).toISODate(),
            }}
            slotMinTime={timeSlots.start}
            slotMaxTime={timeSlots.end}
            slotDuration={timeSlots.interval}
            height="auto"
            contentHeight="80vh"
            stickyHeaderDates={true}
            resourceAreaWidth="120px"
            resourceAreaHeaderContent="Time"
            resourceGroupField="date"
            resourceOrder="title"
            editable={true}
            selectable={true}
            selectMirror={true}
            eventClick={onEventClick}
            select={onSlotSelect}
            resourceLabelDidMount={(info) => {
              info.el.addEventListener('click', () => onResourceClick(info));
            }}
            dateClick={onDateClick}
            eventContent={(info) => (
              <div className="text-xs font-medium p-1" style={{ backgroundColor: info.event.backgroundColor || '#3498db', color: '#fff' }}>
                {info.event.title}
              </div>
            )}
            resourceLabelContent={(info) => (
              <div className="text-xs font-medium text-gray-700">
                {info.resource.extendedProps.title}
                {info.resource.extendedProps.specialty && <div className="text-xs text-gray-500">{info.resource.extendedProps.specialty}</div>}
              </div>
            )}
            slotLabelContent={(info) => <div className="text-xs text-gray-600">{info.text}</div>}
            schedulerLicenseKey="YOUR_LICENSE_KEY_HERE" // Replace with your actual FullCalendar license key
            className="fc-custom"
          />
        </div>

        {/* Global CSS for Sticky Headers and Time Slots */}
        <style>
          {`
            .fc-custom .fc-scroller-harness {
              overflow-x: auto !important;
            }
            .fc-custom .fc-resource-timeline-lane {
              min-width: 150px;
            }
            .fc-custom .fc-resource-timeline-resource {
              background-color: #f3f4f6;
              border-right: 1px solid #e5e7eb;
            }
            .fc-custom .fc-timeline-slot {
              border-bottom: 1px solid #e5e7eb;
            }
            .fc-custom .fc-resource-timeline-divider {
              background-color: #e5e7eb;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ResourceTimelineCalendar;
