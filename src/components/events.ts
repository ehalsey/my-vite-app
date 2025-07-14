export const events = [
  { title: 'Consult (P1)', start: '2025-07-06T09:00:00', end: '2025-07-06T10:00:00', providerId: 'provider-1' }, // Sunday
  { title: 'Surgery (P2)', start: '2025-07-07T14:00:00', end: '2025-07-07T15:30:00', providerId: 'provider-2' }, // Monday
  { title: 'Checkup (P3)', start: '2025-07-08T10:00:00', end: '2025-07-08T11:00:00', providerId: 'provider-3' }, // Tuesday
  { title: 'Follow-up (P4)', start: '2025-07-09T15:00:00', end: '2025-07-09T16:30:00', providerId: 'provider-4' }, // Wednesday
  { title: 'Therapy (P5)', start: '2025-07-10T11:00:00', end: '2025-07-10T12:00:00', providerId: 'provider-5' }, // Thursday
  { title: 'Consult (P6)', start: '2025-07-11T16:00:00', end: '2025-07-11T17:30:00', providerId: 'provider-6' }, // Friday
  { title: 'Checkup (P7)', start: '2025-07-12T12:00:00', end: '2025-07-12T13:00:00', providerId: 'provider-7' }, // Saturday
  { title: 'Surgery (P8)', start: '2025-07-07T09:00:00', end: '2025-07-07T10:30:00', providerId: 'provider-8' }, // Monday
  { title: 'Therapy (P9)', start: '2025-07-08T14:00:00', end: '2025-07-08T15:00:00', providerId: 'provider-9' }, // Tuesday
  { title: 'Follow-up (P10)', start: '2025-07-09T10:00:00', end: '2025-07-09T11:30:00', providerId: 'provider-10' } // Wednesday
];


  // Sample appointments across multiple days
  export const appointments = [
    // July 13, 2025 (Today)
    {
      id: '1',
      title: 'Annual Checkup - John Doe',
      start: '2025-07-13T09:00:00',
      end: '2025-07-13T10:00:00',
      resourceId: 'doctor1',
      patient: 'John Doe',
      type: 'Checkup'
    },
    {
      id: '2',
      title: 'Follow-up - Jane Smith',
      start: '2025-07-13T14:30:00',
      end: '2025-07-13T15:30:00',
      resourceId: 'doctor1',
      patient: 'Jane Smith',
      type: 'Follow-up'
    },
    {
      id: '3',
      title: 'Cardiac Consultation - Mike Johnson',
      start: '2025-07-13T10:00:00',
      end: '2025-07-13T11:00:00',
      resourceId: 'doctor2',
      patient: 'Mike Johnson',
      type: 'Consultation'
    },
    {
      id: '4',
      title: 'Surgery - Robert Brown',
      start: '2025-07-13T08:00:00',
      end: '2025-07-13T12:00:00',
      resourceId: 'doctor3',
      patient: 'Robert Brown',
      type: 'Surgery'
    },
    {
      id: '5',
      title: 'Pediatric Check - Alex Chen',
      start: '2025-07-13T11:00:00',
      end: '2025-07-13T12:00:00',
      resourceId: 'doctor4',
      patient: 'Alex Chen',
      type: 'Checkup'
    },
    {
      id: '50',
      title: 'Neurological Exam - Sarah Williams',
      start: '2025-07-13T13:00:00',
      end: '2025-07-13T14:00:00',
      resourceId: 'doctor7',
      patient: 'Sarah Williams',
      type: 'Exam'
    },
    {
      id: '51',
      title: 'Therapy Session - Mark Davis',
      start: '2025-07-13T15:00:00',
      end: '2025-07-13T16:00:00',
      resourceId: 'doctor8',
      patient: 'Mark Davis',
      type: 'Therapy'
    },
    {
      id: '52',
      title: 'Eye Surgery - Linda Rodriguez',
      start: '2025-07-13T08:30:00',
      end: '2025-07-13T10:30:00',
      resourceId: 'doctor9',
      patient: 'Linda Rodriguez',
      type: 'Surgery'
    },
    {
      id: '53',
      title: 'Cancer Treatment - James Wilson',
      start: '2025-07-13T09:00:00',
      end: '2025-07-13T11:00:00',
      resourceId: 'doctor13',
      patient: 'James Wilson',
      type: 'Treatment'
    },
    {
      id: '54',
      title: 'Emergency Consultation - Maria Garcia',
      start: '2025-07-13T16:00:00',
      end: '2025-07-13T17:00:00',
      resourceId: 'doctor16',
      patient: 'Maria Garcia',
      type: 'Emergency'
    },

    // July 14, 2025 (Tomorrow)
    {
      id: '6',
      title: 'Physical Therapy - Sarah Wilson',
      start: '2025-07-14T09:00:00',
      end: '2025-07-14T10:00:00',
      resourceId: 'doctor1',
      patient: 'Sarah Wilson',
      type: 'Therapy'
    },
    {
      id: '7',
      title: 'Heart Monitoring - Emma Taylor',
      start: '2025-07-14T10:30:00',
      end: '2025-07-14T11:30:00',
      resourceId: 'doctor2',
      patient: 'Emma Taylor',
      type: 'Monitoring'
    },
    {
      id: '8',
      title: 'Post-op Check - Lisa Davis',
      start: '2025-07-14T15:00:00',
      end: '2025-07-14T16:00:00',
      resourceId: 'doctor3',
      patient: 'Lisa Davis',
      type: 'Post-op'
    },
    {
      id: '9',
      title: 'Vaccination - Maya Patel',
      start: '2025-07-14T14:00:00',
      end: '2025-07-14T14:30:00',
      resourceId: 'doctor4',
      patient: 'Maya Patel',
      type: 'Vaccination'
    },
    {
      id: '10',
      title: 'Skin Check - Chris Lee',
      start: '2025-07-14T13:00:00',
      end: '2025-07-14T14:00:00',
      resourceId: 'doctor6',
      patient: 'Chris Lee',
      type: 'Screening'
    },
    {
      id: '55',
      title: 'Orthopedic Surgery - Daniel Kim',
      start: '2025-07-14T08:00:00',
      end: '2025-07-14T12:00:00',
      resourceId: 'doctor5',
      patient: 'Daniel Kim',
      type: 'Surgery'
    },
    {
      id: '56',
      title: 'Brain Scan - Jennifer Brown',
      start: '2025-07-14T11:00:00',
      end: '2025-07-14T12:00:00',
      resourceId: 'doctor7',
      patient: 'Jennifer Brown',
      type: 'Scan'
    },
    {
      id: '57',
      title: 'Endoscopy - Robert Martinez',
      start: '2025-07-14T13:30:00',
      end: '2025-07-14T14:30:00',
      resourceId: 'doctor11',
      patient: 'Robert Martinez',
      type: 'Procedure'
    },
    {
      id: '58',
      title: 'Chemotherapy - Patricia Anderson',
      start: '2025-07-14T10:00:00',
      end: '2025-07-14T13:00:00',
      resourceId: 'doctor13',
      patient: 'Patricia Anderson',
      type: 'Treatment'
    },
    {
      id: '59',
      title: 'Kidney Function Test - Thomas Lopez',
      start: '2025-07-14T15:30:00',
      end: '2025-07-14T16:30:00',
      resourceId: 'doctor22',
      patient: 'Thomas Lopez',
      type: 'Test'
    },

    // July 15, 2025
    {
      id: '11',
      title: 'Consultation - Tom Anderson',
      start: '2025-07-15T09:30:00',
      end: '2025-07-15T11:00:00',
      resourceId: 'doctor2',
      patient: 'Tom Anderson',
      type: 'Consultation'
    },
    {
      id: '12',
      title: 'Orthopedic Eval - Patricia Garcia',
      start: '2025-07-15T10:00:00',
      end: '2025-07-15T11:00:00',
      resourceId: 'doctor5',
      patient: 'Patricia Garcia',
      type: 'Evaluation'
    },
    {
      id: '13',
      title: 'Routine Check - David Kim',
      start: '2025-07-15T16:00:00',
      end: '2025-07-15T17:00:00',
      resourceId: 'doctor1',
      patient: 'David Kim',
      type: 'Checkup'
    },
    {
      id: '60',
      title: 'Plastic Surgery - Amanda Clark',
      start: '2025-07-15T08:00:00',
      end: '2025-07-15T11:00:00',
      resourceId: 'doctor30',
      patient: 'Amanda Clark',
      type: 'Surgery'
    },
    {
      id: '61',
      title: 'Pulmonary Function - Carlos Gonzalez',
      start: '2025-07-15T14:00:00',
      end: '2025-07-15T15:00:00',
      resourceId: 'doctor21',
      patient: 'Carlos Gonzalez',
      type: 'Test'
    },
    {
      id: '62',
      title: 'Pain Management - Susan Harris',
      start: '2025-07-15T13:00:00',
      end: '2025-07-15T14:00:00',
      resourceId: 'doctor29',
      patient: 'Susan Harris',
      type: 'Treatment'
    },
    {
      id: '63',
      title: 'Geriatric Assessment - Henry Hall',
      start: '2025-07-15T15:00:00',
      end: '2025-07-15T16:30:00',
      resourceId: 'doctor28',
      patient: 'Henry Hall',
      type: 'Assessment'
    },
    {
      id: '64',
      title: 'Sports Injury - Kevin Perez',
      start: '2025-07-15T11:30:00',
      end: '2025-07-15T12:30:00',
      resourceId: 'doctor27',
      patient: 'Kevin Perez',
      type: 'Treatment'
    },

    // July 16, 2025
    {
      id: '14',
      title: 'Emergency Surgery - Maria Rodriguez',
      start: '2025-07-16T07:00:00',
      end: '2025-07-16T11:00:00',
      resourceId: 'doctor3',
      patient: 'Maria Rodriguez',
      type: 'Emergency'
    },
    {
      id: '15',
      title: 'Dermatology Consult - James Wilson',
      start: '2025-07-16T14:00:00',
      end: '2025-07-16T15:00:00',
      resourceId: 'doctor6',
      patient: 'James Wilson',
      type: 'Consultation'
    },
    {
      id: '16',
      title: 'Child Wellness - Sophie Brown',
      start: '2025-07-16T15:30:00',
      end: '2025-07-16T16:30:00',
      resourceId: 'doctor4',
      patient: 'Sophie Brown',
      type: 'Wellness'
    },
    {
      id: '65',
      title: 'Vascular Surgery - Michael King',
      start: '2025-07-16T08:30:00',
      end: '2025-07-16T12:30:00',
      resourceId: 'doctor31',
      patient: 'Michael King',
      type: 'Surgery'
    },
    {
      id: '66',
      title: 'Blood Work - Rachel Young',
      start: '2025-07-16T10:00:00',
      end: '2025-07-16T11:00:00',
      resourceId: 'doctor23',
      patient: 'Rachel Young',
      type: 'Lab Work'
    },
    {
      id: '67',
      title: 'Infectious Disease - Peter Allen',
      start: '2025-07-16T13:30:00',
      end: '2025-07-16T14:30:00',
      resourceId: 'doctor24',
      patient: 'Peter Allen',
      type: 'Treatment'
    },
    {
      id: '68',
      title: 'Physical Rehab - Lisa Robinson',
      start: '2025-07-16T16:00:00',
      end: '2025-07-16T17:00:00',
      resourceId: 'doctor25',
      patient: 'Lisa Robinson',
      type: 'Rehabilitation'
    },
    {
      id: '69',
      title: 'Family Consultation - John Walker',
      start: '2025-07-16T11:30:00',
      end: '2025-07-16T12:30:00',
      resourceId: 'doctor26',
      patient: 'John Walker',
      type: 'Consultation'
    }
  ];

    // Sample resources (doctors)
  export const resources = [
    { id: 'doctor1', title: 'Dr. Smith', color: '#3498db', specialty: 'General Practice' },
    { id: 'doctor2', title: 'Dr. Johnson', color: '#e74c3c', specialty: 'Cardiology' },
    { id: 'doctor3', title: 'Dr. Brown', color: '#2ecc71', specialty: 'Surgery' },
    { id: 'doctor4', title: 'Dr. Wilson', color: '#f39c12', specialty: 'Pediatrics' },
    { id: 'doctor5', title: 'Dr. Davis', color: '#9b59b6', specialty: 'Orthopedics' },
    { id: 'doctor6', title: 'Dr. Miller', color: '#1abc9c', specialty: 'Dermatology' },
    { id: 'doctor7', title: 'Dr. Garcia', color: '#e67e22', specialty: 'Neurology' },
    { id: 'doctor8', title: 'Dr. Rodriguez', color: '#34495e', specialty: 'Psychiatry' },
    { id: 'doctor9', title: 'Dr. Martinez', color: '#f1c40f', specialty: 'Ophthalmology' },
    { id: 'doctor10', title: 'Dr. Anderson', color: '#95a5a6', specialty: 'ENT' },
    { id: 'doctor11', title: 'Dr. Taylor', color: '#8e44ad', specialty: 'Gastroenterology' },
    { id: 'doctor12', title: 'Dr. Thomas', color: '#d35400', specialty: 'Endocrinology' },
    { id: 'doctor13', title: 'Dr. Hernandez', color: '#27ae60', specialty: 'Oncology' },
    { id: 'doctor14', title: 'Dr. Moore', color: '#2980b9', specialty: 'Radiology' },
    { id: 'doctor15', title: 'Dr. Martin', color: '#c0392b', specialty: 'Anesthesiology' },
    { id: 'doctor16', title: 'Dr. Jackson', color: '#16a085', specialty: 'Emergency Medicine' },
    { id: 'doctor17', title: 'Dr. Thompson', color: '#7f8c8d', specialty: 'Pathology' },
    { id: 'doctor18', title: 'Dr. White', color: '#e91e63', specialty: 'Obstetrics' },
    { id: 'doctor19', title: 'Dr. Lopez', color: '#9c27b0', specialty: 'Urology' },
    { id: 'doctor20', title: 'Dr. Lee', color: '#673ab7', specialty: 'Rheumatology' },
    { id: 'doctor21', title: 'Dr. Gonzalez', color: '#3f51b5', specialty: 'Pulmonology' },
    { id: 'doctor22', title: 'Dr. Harris', color: '#2196f3', specialty: 'Nephrology' },
    { id: 'doctor23', title: 'Dr. Clark', color: '#03a9f4', specialty: 'Hematology' },
    { id: 'doctor24', title: 'Dr. Lewis', color: '#00bcd4', specialty: 'Infectious Disease' },
    { id: 'doctor25', title: 'Dr. Robinson', color: '#009688', specialty: 'Physical Medicine' },
    { id: 'doctor26', title: 'Dr. Walker', color: '#4caf50', specialty: 'Family Medicine' },
    { id: 'doctor27', title: 'Dr. Perez', color: '#8bc34a', specialty: 'Sports Medicine' },
    { id: 'doctor28', title: 'Dr. Hall', color: '#cddc39', specialty: 'Geriatrics' },
    { id: 'doctor29', title: 'Dr. Young', color: '#ffeb3b', specialty: 'Pain Management' },
    { id: 'doctor30', title: 'Dr. Allen', color: '#ffc107', specialty: 'Plastic Surgery' },
    { id: 'doctor31', title: 'Dr. King', color: '#ff9800', specialty: 'Vascular Surgery' }
  ];