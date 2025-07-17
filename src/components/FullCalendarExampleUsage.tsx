import { type CalendarResource, type CalendarEvent, FullCalendarResourceTimeline } from "./FullCalendarResourceTimeline";

const ExampleUsage: React.FC = () => {
  const sampleResources: CalendarResource[] = [
    { id: 'doctor1', title: 'Dr. Smith', color: '#3498db', specialty: 'General Practice', department: 'Primary Care' },
    { id: 'doctor2', title: 'Dr. Johnson', color: '#e74c3c', specialty: 'Cardiology', department: 'Specialized Care' },
    { id: 'doctor3', title: 'Dr. Brown', color: '#2ecc71', specialty: 'Surgery', department: 'Surgical' },
    { id: 'doctor4', title: 'Dr. Wilson', color: '#f39c12', specialty: 'Pediatrics', department: 'Primary Care' },
    { id: 'doctor5', title: 'Dr. Davis', color: '#9b59b6', specialty: 'Orthopedics', department: 'Specialized Care' },
    { id: 'doctor6', title: 'Dr. Miller', color: '#1abc9c', specialty: 'Dermatology', department: 'Specialized Care' }
  ];

  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Patient A - Checkup',
      start: '2025-07-16T09:00:00',
      end: '2025-07-16T10:00:00',
      resourceId: 'doctor1',
      backgroundColor: '#3498db'
    },
    {
      id: '2',
      title: 'Patient B - Follow-up',
      start: '2025-07-16T14:30:00',
      end: '2025-07-16T15:30:00',
      resourceId: 'doctor1'
    },
    {
      id: '3',
      title: 'Patient C - Consultation',
      start: '2025-07-16T10:00:00',
      end: '2025-07-16T11:00:00',
      resourceId: 'doctor2',
      backgroundColor: '#e74c3c'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Medical Schedule - FullCalendar</h1>
      
      <FullCalendarResourceTimeline
        resources={sampleResources}
        events={sampleEvents}
        schedulerLicenseKey="YOUR_LICENSE_KEY_HERE"
        slotMinTime="07:00:00"
        slotMaxTime="19:00:00"
        slotDuration="00:30:00"
        height={600}
        onEventClick={(info) => {
          alert(`Event: ${info.event.title}`);
        }}
        onDateSelect={(info) => {
          console.log('Selected:', info);
        }}
        onResourceClick={(info) => {
          console.log('Resource clicked:', info.resource.title);
        }}
        eventContent={(info) => (
          <div className="p-1">
            <div className="text-xs font-bold">{info.event.title}</div>
            <div className="text-xs opacity-75">
              {info.event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ExampleUsage;