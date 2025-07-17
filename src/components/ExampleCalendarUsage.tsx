import type { CalendarResource, CalendarEvent, EventClickHandler, EventDragEndHandler, SlotClickHandler, ResourceClickHandler, DateClickHandler, ResourceSelectionChangeHandler, EventStyler, EventRenderer, ResourceRenderer } from "../types/calendarTypes";
import MultiResourceCalendar from "./MultiResourceCalendar";


// Example usage component with proper typing
const ExampleCalendarUsage: React.FC = () => {
  // Sample resources with proper typing
  const resources: CalendarResource[] = [
    { id: 'doctor1', title: 'Dr. Smith', color: '#3498db', specialty: 'General Practice' },
    { id: 'doctor2', title: 'Dr. Johnson', color: '#e74c3c', specialty: 'Cardiology' },
    { id: 'doctor3', title: 'Dr. Brown', color: '#2ecc71', specialty: 'Surgery' },
    { id: 'doctor4', title: 'Dr. Wilson', color: '#f39c12', specialty: 'Pediatrics' },
    { id: 'doctor5', title: 'Dr. Davis', color: '#9b59b6', specialty: 'Orthopedics' },
    { id: 'doctor6', title: 'Dr. Miller', color: '#1abc9c', specialty: 'Dermatology' }
  ];

  // Sample events with proper typing
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Annual Checkup - John Doe',
      start: '2025-07-13T09:00:00',
      end: '2025-07-13T10:00:00',
      resourceId: 'doctor1',
      backgroundColor: '#3498db',
      textColor: 'white'
    },
    {
      id: '2',
      title: 'Follow-up - Jane Smith',
      start: '2025-07-13T14:30:00',
      end: '2025-07-13T15:30:00',
      resourceId: 'doctor1'
    },
    {
      id: '3',
      title: 'Cardiac Consultation - Mike Johnson',
      start: '2025-07-13T10:00:00',
      end: '2025-07-13T11:00:00',
      resourceId: 'doctor2',
      backgroundColor: '#e74c3c'
    },
    {
      id: '4',
      title: 'Surgery - Robert Brown',
      start: '2025-07-13T08:00:00',
      end: '2025-07-13T12:00:00',
      resourceId: 'doctor3',
      backgroundColor: '#27ae60',
      borderColor: '#1e8449'
    }
  ];

  // Event handlers with proper typing
  const handleEventClick: EventClickHandler = (event) => {
    console.log('Event clicked:', event);
    alert(`Clicked on: ${event.title}`);
  };

  const handleEventDragEnd: EventDragEndHandler = (dragInfo) => {
    console.log('Event moved:', dragInfo);
    // Here you would update your state/backend
  };

  const handleSlotClick: SlotClickHandler = (date, time, resourceId) => {
    console.log('Slot clicked:', { date, time, resourceId });
    // Here you would open a create appointment modal
  };

  const handleResourceClick: ResourceClickHandler = (resource) => {
    console.log('Resource clicked:', resource);
  };

  const handleDateClick: DateClickHandler = (dateInfo) => {
    console.log('Date clicked:', dateInfo);
  };

  const handleResourceSelectionChange: ResourceSelectionChangeHandler = (selectedIds) => {
    console.log('Resource selection changed:', selectedIds);
  };

  // Custom event styling with proper typing
  const customEventStyler: EventStyler = (event) => {
    const customProps = event as CalendarEvent & { priority?: string; confirmed?: boolean };
    
    if (customProps.priority === 'high') {
      return {
        backgroundColor: '#e74c3c',
        border: '2px solid #c0392b',
        fontWeight: 'bold'
      };
    }
    
    if (customProps.confirmed === false) {
      return {
        backgroundColor: '#95a5a6',
        border: '1px dashed #7f8c8d'
      };
    }
    
    return {};
  };

  // Custom event renderer with proper typing
  const customEventRenderer: EventRenderer = (event) => {
    const customEvent = event as CalendarEvent & { patient?: string; type?: string };
    
    return (
      <div>
        <div className="font-bold text-xs">{customEvent.patient || event.title}</div>
        <div className="text-xs opacity-90">{customEvent.type || 'Appointment'}</div>
        <div className="text-xs opacity-80">
          {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  // Custom resource renderer with proper typing
  const customResourceRenderer: ResourceRenderer = (resource) => (
    <div>
      <div className="text-xs font-medium" style={{ color: resource.color }}>
        {resource.title}
      </div>
      <div className="text-xs text-gray-500">{resource.specialty}</div>
      {resource.department && (
        <div className="text-xs text-gray-400">{resource.department}</div>
      )}
    </div>
  );

  return (
    <MultiResourceCalendar
      resources={resources}
      events={events}
      startDate="2025-07-13"
      endDate="2025-07-16"
      showFilters={true}
      enableDragDrop={true}
      onEventClick={handleEventClick}
      onEventDragEnd={handleEventDragEnd}
      onSlotClick={handleSlotClick}
      onResourceClick={handleResourceClick}
      onDateClick={handleDateClick}
      onResourceSelectionChange={handleResourceSelectionChange}
      eventStyler={customEventStyler}
      eventRenderer={customEventRenderer}
      resourceRenderer={customResourceRenderer}
      timeSlots={{ start: 7, end: 18, interval: 30 }}
      columnWidth={{ comfortable: 200, compact: 150 }}
      maxHeight={96}
      locale="en-US"
      className="custom-calendar"
      ariaLabel="Medical appointment calendar"
    />
  );
};

export default ExampleCalendarUsage;