import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, { type EventResizeStopArg } from '@fullcalendar/interaction';
import { type EventClickArg, type DateSelectArg, ResourceLabelContentArg, type EventApi, type EventDropArg, type EventInput } from '@fullcalendar/core';
import type { ResourceInput } from '@fullcalendar/resource';

// TypeScript interfaces
export interface CalendarResource {
  id: string;
  title: string;
  color?: string;
  specialty?: string;
  department?: string;
  email?: string;
  phone?: string;
  extendedProps?: Record<string, unknown>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: Record<string, unknown>;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ResourceAreaColumn {
  field: string;
  headerContent: string;
  width?: number;
}

export interface EventContentArg {
  event: EventApi;
  timeText: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  isStart: boolean;
  isEnd: boolean;
  isPast: boolean;
  isFuture: boolean;
  isToday: boolean;
  view: {
    type: string;
    title: string;
  };
}

export interface ResourceLabelContentArg {
  resource: {
    id: string;
    title: string;
    extendedProps: Record<string, unknown>;
  };
  view: {
    type: string;
    title: string;
  };
}

export interface ResourceClickArg {
  resource: {
    id: string;
    title: string;
    extendedProps: Record<string, unknown>;
  };
  jsEvent: Event;
  view: {
    type: string;
    title: string;
  };
}

export interface FullCalendarResourceTimelineProps {
  // Data
  resources: CalendarResource[];
  events: CalendarEvent[];
  
  // Date configuration
  initialDate?: string;
  dateRange?: DateRange;
  
  // Display options
  slotMinTime?: string; // e.g., '07:00:00'
  slotMaxTime?: string; // e.g., '19:00:00'
  slotDuration?: string; // e.g., '00:30:00'
  slotLabelInterval?: string; // e.g., '01:00:00'
  
  // View options
  resourceAreaWidth?: string | number;
  resourceAreaColumns?: ResourceAreaColumn[];
  
  // Event handlers
  onEventClick?: (info: EventClickArg) => void;
  onEventDrop?: (info: EventDropArg) => void;
  onEventResize?: (info: EventResizeStopArg) => void;
  onDateSelect?: (info: DateSelectArg) => void;
  onResourceClick?: (info: ResourceClickArg) => void;
  
  // Filtering
  selectedResources?: string[];
  onResourceSelectionChange?: (selectedResourceIds: string[]) => void;
  
  // Customization
  eventContent?: (info: EventContentArg) => React.ReactNode;
  resourceLabelContent?: (info: ResourceLabelContentArg) => React.ReactNode;
  
  // License
  schedulerLicenseKey?: string;
  
  // Additional FullCalendar options
  height?: string | number;
  aspectRatio?: number;
  editable?: boolean;
  selectable?: boolean;
  selectMirror?: boolean;
  dayMaxEvents?: boolean | number;
  weekends?: boolean;
  nowIndicator?: boolean;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
}

// Collapsible Date Filter Component
interface DateFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  dateRange,
  onDateRangeChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const handleDateRangePreset = (preset: 'today' | 'week' | 'month' | 'quarter') => {
    const today = new Date();
    let start: string, end: string;
    
    switch (preset) {
      case 'today': {
        start = end = today.toISOString().split('T')[0];
        break;
      }
      case 'week': {
        start = today.toISOString().split('T')[0];
        end = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      }
      case 'month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      }
      case 'quarter': {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), quarter * 3 + 3, 0).toISOString().split('T')[0];
        break;
      }
      default:
        return;
    }
    
    onDateRangeChange({ start, end });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Date Range Filter</h3>
        <button
          onClick={onToggleCollapse}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-expanded={!isCollapsed}
        >
          <svg 
            className={`w-4 h-4 transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>{isCollapsed ? 'Show' : 'Hide'}</span>
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-96'
      }`}>
        <div className="p-4 space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' },
                { key: 'quarter', label: 'This Quarter' }
              ].map(preset => (
                <button
                  key={preset.key}
                  onClick={() => handleDateRangePreset(preset.key as 'today' | 'week' | 'month' | 'quarter')}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                min={dateRange.start}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Range Summary */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected Range:</strong> {' '}
              {new Date(dateRange.start).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {dateRange.start !== dateRange.end && (
                <>
                  {' '} to {' '}
                  {new Date(dateRange.end).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </>
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) + 1} day(s) selected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resource Filter Component
interface ResourceFilterProps {
  resources: CalendarResource[];
  selectedResources: string[];
  onResourceSelectionChange: (selectedIds: string[]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ResourceFilter: React.FC<ResourceFilterProps> = ({
  resources,
  selectedResources,
  onResourceSelectionChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleResourceToggle = (resourceId: string) => {
    const newSelection = selectedResources.includes(resourceId)
      ? selectedResources.filter(id => id !== resourceId)
      : [...selectedResources, resourceId];
    
    onResourceSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const newSelection = selectedResources.length === resources.length 
      ? [] 
      : resources.map(r => r.id);
    onResourceSelectionChange(newSelection);
  };

  const getSpecialties = () => {
    const specialties = [...new Set(resources.map(r => r.specialty).filter(Boolean))];
    return specialties;
  };

  const handleSpecialtyFilter = (specialty: string) => {
    const resourcesInSpecialty = resources
      .filter(r => r.specialty === specialty)
      .map(r => r.id);
    
    onResourceSelectionChange(resourcesInSpecialty);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Provider Filter</h3>
        <button
          onClick={onToggleCollapse}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          aria-expanded={!isCollapsed}
        >
          <svg 
            className={`w-4 h-4 transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>{isCollapsed ? 'Show' : 'Hide'}</span>
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-96'
      }`}>
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {selectedResources.length === resources.length ? 'Clear All' : 'Select All'}
            </button>
            
            {getSpecialties().map(specialty => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyFilter(specialty!)}
                className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                {specialty}
              </button>
            ))}
          </div>

          {/* Resource Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Providers ({selectedResources.length} of {resources.length} selected)
              </label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showDropdown ? 'Hide List' : 'Show List'}
              </button>
            </div>

            {showDropdown && (
              <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white">
                {resources.map(resource => (
                  <label
                    key={resource.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource.id)}
                      onChange={() => handleResourceToggle(resource.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: resource.color || '#3498db' }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                        {resource.specialty && (
                          <div className="text-xs text-gray-500">{resource.specialty}</div>
                        )}
                        {resource.department && (
                          <div className="text-xs text-gray-400">{resource.department}</div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Selection Summary */}
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Active Providers:</strong> {selectedResources.length === 0 ? 'All' : selectedResources.length}
            </p>
            {selectedResources.length > 0 && selectedResources.length < resources.length && (
              <p className="text-xs text-green-600 mt-1">
                Showing filtered view with selected providers only
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main FullCalendar Component
const FullCalendarResourceTimeline: React.FC<FullCalendarResourceTimelineProps> = ({
  resources = [],
  events = [],
  initialDate,
  dateRange,
  slotMinTime = '07:00:00',
  slotMaxTime = '19:00:00',
  slotDuration = '00:30:00',
  slotLabelInterval = '01:00:00',
  resourceAreaWidth = 200,
  resourceAreaColumns = [
    { field: 'title', headerContent: 'Provider' },
    { field: 'specialty', headerContent: 'Specialty' }
  ],
  onEventClick,
  onEventDrop,
  onEventResize,
  onDateSelect,
  onResourceClick,
  selectedResources = [],
  onResourceSelectionChange = () => {},
  eventContent,
  resourceLabelContent,
  schedulerLicenseKey = 'CC-Attribution-NonCommercial-NoDerivatives',
  height = 'auto',
  aspectRatio,
  editable = true,
  selectable = true,
  selectMirror = true,
  dayMaxEvents = false,
  weekends = true,
  nowIndicator = true,
  className = '',
  style = {},
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [internalDateRange, setInternalDateRange] = useState<DateRange>(
    dateRange || {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  );
  const [internalSelectedResources, setInternalSelectedResources] = useState<string[]>(selectedResources);
  const [dateFilterCollapsed, setDateFilterCollapsed] = useState(false);
  const [resourceFilterCollapsed, setResourceFilterCollapsed] = useState(false);

  // Update calendar when date range changes
  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(internalDateRange.start);
    }
  }, [internalDateRange]);

  // Convert resources to FullCalendar format
  const fullCalendarResources: ResourceInput[] = resources
    .filter(resource => 
      internalSelectedResources.length === 0 || internalSelectedResources.includes(resource.id)
    )
    .map(resource => ({
      id: resource.id,
      title: resource.title,
      extendedProps: {
        specialty: resource.specialty,
        department: resource.department,
        color: resource.color,
        ...resource.extendedProps
      }
    }));

  // Convert events to FullCalendar format
  const fullCalendarEvents: EventInput[] = events
    .filter(event => {
      // Filter by date range
      const eventDate = event.start.split('T')[0];
      return eventDate >= internalDateRange.start && eventDate <= internalDateRange.end;
    })
    .filter(event => {
      // Filter by selected resources
      return internalSelectedResources.length === 0 || internalSelectedResources.includes(event.resourceId);
    })
    .map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      resourceId: event.resourceId,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      textColor: event.textColor,
      extendedProps: event.extendedProps
    }));

  const handleResourceSelectionChange = (selectedIds: string[]) => {
    setInternalSelectedResources(selectedIds);
    onResourceSelectionChange(selectedIds);
  };

  return (
    <div className={`fullcalendar-resource-timeline ${className}`} style={style}>
      {/* Date Range Filter */}
      <DateFilter
        dateRange={internalDateRange}
        onDateRangeChange={setInternalDateRange}
        isCollapsed={dateFilterCollapsed}
        onToggleCollapse={() => setDateFilterCollapsed(!dateFilterCollapsed)}
      />

      {/* Resource Filter */}
      <ResourceFilter
        resources={resources}
        selectedResources={internalSelectedResources}
        onResourceSelectionChange={handleResourceSelectionChange}
        isCollapsed={resourceFilterCollapsed}
        onToggleCollapse={() => setResourceFilterCollapsed(!resourceFilterCollapsed)}
      />

      {/* FullCalendar */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimelineDay"
          initialDate={initialDate || internalDateRange.start}
          
          // Scheduler License
          schedulerLicenseKey={schedulerLicenseKey}
          
          // Data
          resources={fullCalendarResources}
          events={fullCalendarEvents}
          
          // Time settings
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
          slotDuration={slotDuration}
          slotLabelInterval={slotLabelInterval}
          
          // Resource settings
          resourceAreaWidth={resourceAreaWidth}
          resourceAreaColumns={resourceAreaColumns}
          resourceOrder="title"
          
          // View settings
          height={height}
          aspectRatio={aspectRatio}
          
          // Interaction
          editable={editable}
          selectable={selectable}
          selectMirror={selectMirror}
          
          // Display options
          dayMaxEvents={dayMaxEvents}
          weekends={weekends}
          nowIndicator={nowIndicator}
          
          // Header
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimelineDay,resourceTimelineWeek'
          }}
          
          // Sticky headers for scrolling
          stickyHeaderDates={true}
          stickyFooterScrollbar={true}
          
          // Event handlers
          eventClick={onEventClick}
          eventDrop={onEventDrop}
          eventResize={onEventResize}
          select={onDateSelect}
          
          // Custom content
          eventContent={eventContent}
          resourceLabelContent={resourceLabelContent}
          
          // Date formatting
          validRange={{
            start: internalDateRange.start,
            end: new Date(new Date(internalDateRange.end).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }}
          
          // Additional options for horizontal scrolling
          scrollTime="08:00:00"
          scrollTimeReset={false}
        />
      </div>
    </div>
  );
};

export { FullCalendarResourceTimeline, DateFilter, ResourceFilter };