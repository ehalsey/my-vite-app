// src/types/calendarTypes.ts
import type { CSSProperties, ReactNode } from 'react';

// Core type definitions
export interface CalendarResource {
  id: string;
  title: string;
  color?: string;
  specialty?: string;
  department?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  className?: string | string[];
  url?: string;
  editable?: boolean;
  startEditable?: boolean;
  durationEditable?: boolean;
  display?: 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';
  overlap?: boolean;
  constraint?: string | object;
  [key: string]: unknown;
}

export interface TimeSlotConfig {
  start: number;
  end: number;
  interval: 15 | 30 | 60;
}

export interface ColumnWidthConfig {
  comfortable: number;
  compact: number;
}

export interface DateInfo {
  date: Date;
  dateString: string;
  displayDate: string;
  fullDate: string;
}

export interface DragInfo {
  event: CalendarEvent;
  newStart: string;
  newEnd: string;
  newResourceId: string;
  originalEvent: CalendarEvent;
}

export interface MultiResourceCalendarProps {
  resources?: CalendarResource[];
  events?: CalendarEvent[];
  startDate?: string;
  endDate?: string;
  timeSlots?: TimeSlotConfig;
  compactMode?: boolean;
  showFilters?: boolean;
  maxHeight?: number;
  columnWidth?: ColumnWidthConfig;
  onEventClick?: (event: CalendarEvent, jsEvent: React.MouseEvent) => void;
  onEventDragStart?: (event: CalendarEvent, jsEvent: React.MouseEvent) => void;
  onEventDragEnd?: (dragInfo: DragInfo) => void;
  onSlotClick?: (date: string, time: string, resourceId: string, jsEvent: React.MouseEvent) => void;
  onResourceClick?: (resource: CalendarResource, jsEvent: React.MouseEvent) => void;
  onDateClick?: (dateInfo: DateInfo, jsEvent: React.MouseEvent) => void;
  onResourceSelectionChange?: (selectedResourceIds: string[]) => void;
  eventStyler?: (event: CalendarEvent) => CSSProperties;
  resourceStyler?: (resource: CalendarResource) => CSSProperties;
  slotStyler?: (date: string, time: string | null, resource: CalendarResource) => CSSProperties;
  eventRenderer?: (event: CalendarEvent) => ReactNode;
  resourceRenderer?: (resource: CalendarResource) => ReactNode;
  dateRenderer?: (dateInfo: DateInfo) => ReactNode;
  selectedResources?: string[];
  className?: string;
  style?: CSSProperties;
  locale?: string | { code: string; timeFormat: Intl.DateTimeFormatOptions; dateFormat: Intl.DateTimeFormatOptions; firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6 };
  enableDragDrop?: boolean;
  dragConstraints?: { startTime?: string; endTime?: string; resourceIds?: string[]; businessHours?: boolean };
  loading?: boolean;
  error?: string | null;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  headerToolbar?: boolean;
  nowIndicator?: boolean;
  selectMirror?: boolean;
  weekends?: boolean;
  businessHours?: object | object[];
  eventClassNames?: string | string[] | ((event: CalendarEvent) => string | string[]);
  resourceClassNames?: string | string[] | ((resource: CalendarResource) => string | string[]);
  height?: number | 'auto';
  aspectRatio?: number;
  eventMaxStack?: number;
  dayMaxEvents?: boolean | number;
  dayMaxEventRows?: boolean | number;
  schedulerLicenseKey?: string;
  plugins?: string[];
}

// Event handler types
export type EventClickHandler = (event: CalendarEvent, jsEvent: React.MouseEvent) => void;
export type EventDragStartHandler = (event: CalendarEvent, jsEvent: React.MouseEvent) => void;
export type EventDragEndHandler = (dragInfo: DragInfo) => void;
export type SlotClickHandler = (date: string, time: string, resourceId: string, jsEvent: React.MouseEvent) => void;
export type ResourceClickHandler = (resource: CalendarResource, jsEvent: React.MouseEvent) => void;
export type DateClickHandler = (dateInfo: DateInfo, jsEvent: React.MouseEvent) => void;
export type ResourceSelectionChangeHandler = (selectedResourceIds: string[]) => void;

// Styling function types
export type EventStyler = (event: CalendarEvent) => CSSProperties;
export type ResourceStyler = (resource: CalendarResource) => CSSProperties;
export type SlotStyler = (date: string, time: string | null, resource: CalendarResource) => CSSProperties;

// Renderer function types
export type EventRenderer = (event: CalendarEvent) => ReactNode;
export type ResourceRenderer = (resource: CalendarResource) => ReactNode;
export type DateRenderer = (dateInfo: DateInfo) => ReactNode;

// Constraint types
export interface DragConstraint {
  startTime?: string;
  endTime?: string;
  resourceIds?: string[];
  businessHours?: boolean;
}

// Localization types
export interface LocaleConfig {
  code: string;
  timeFormat: Intl.DateTimeFormatOptions;
  dateFormat: Intl.DateTimeFormatOptions;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

// Utility type guards
export const isValidTimeSlot = (timeSlots: TimeSlotConfig): boolean => {
  return (
    timeSlots.start >= 0 &&
    timeSlots.start <= 23 &&
    timeSlots.end >= 0 &&
    timeSlots.end <= 23 &&
    timeSlots.start < timeSlots.end &&
    [15, 30, 60].includes(timeSlots.interval)
  );
};

export const isValidEvent = (event: CalendarEvent): boolean => {
  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.start === 'string' &&
    typeof event.end === 'string' &&
    typeof event.resourceId === 'string' &&
    new Date(event.start).getTime() < new Date(event.end).getTime()
  );
};

export const isValidResource = (resource: CalendarResource): boolean => {
  return (
    typeof resource.id === 'string' &&
    typeof resource.title === 'string'
  );
};

// src/types/calendarTypes.ts
// ... (other imports and types remain unchanged)

export interface CalendarState {
  showFiltersPanel: boolean;
  selectedDoctors: string[];
  internalStartDate: string;
  internalEndDate: string;
  showDoctorDropdown: boolean;
  draggedEvent: CalendarEvent | null;
  compactMode: boolean;
}