const minWidthPx = 100; // Minimum width in pixelsimport React, { useEffect, useRef, useState } from 'react';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import React, { useEffect, useRef, useState } from 'react';

const ResizablePanels: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[]>([]); // Pixel widths
  const [isPanel3Extended, setIsPanel3Extended] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    container?: {
      clientWidth: number;
      scrollWidth: number;
      offsetWidth: number;
      style: {
        width: string;
        overflowX: string;
        overflowY: string;
      };
    };
    content?: {
      clientWidth: number;
      scrollWidth: number;
      offsetWidth: number;
      style: {
        width: string;
      };
    };
    hasOverflow?: boolean;
    shouldShowScrollbar?: boolean;
  }>({});
  
  // Force FullCalendar to resize when panel width changes
  useEffect(() => {
    if (widths.length > 0) {
      // Trigger FullCalendar resize after width change
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200); // Increased delay to ensure proper rendering
    }
  }, [widths]);

  // Additional effect to ensure calendar renders after initial load
  useEffect(() => {
    // Force calendar to render after component mounts
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }, []);

  // Sample calendar events
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: '1',
      title: 'Team Meeting',
      date: '2025-01-15',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8'
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: '2025-01-20',
      backgroundColor: '#ef4444',
      borderColor: '#dc2626'
    },
    {
      id: '3',
      title: 'Client Call',
      date: '2025-01-22',
      backgroundColor: '#10b981',
      borderColor: '#059669'
    },
    {
      id: '4',
      title: 'Code Review',
      date: '2025-01-25',
      backgroundColor: '#f59e0b',
      borderColor: '#d97706'
    }
  ]);

  // Calendar event handlers with proper types
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        date: selectInfo.startStr, // Use startStr instead of dateStr
        backgroundColor: '#6366f1',
        borderColor: '#4f46e5'
      };
      
      setCalendarEvents(prev => [...prev, newEvent]);
      console.log('📅 New event added:', newEvent);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      setCalendarEvents(prev => prev.filter(event => event.id !== clickInfo.event.id));
      console.log('📅 Event deleted:', clickInfo.event.title);
    }
  };

  // Debug function to measure scroll container dimensions
  const measureScrollContainer = () => {
    if (scrollContainerRef.current && scrollContentRef.current) {
      const container = scrollContainerRef.current;
      const content = scrollContentRef.current;
      
      const measurements = {
        container: {
          clientWidth: container.clientWidth,
          scrollWidth: container.scrollWidth,
          offsetWidth: container.offsetWidth,
          style: {
            width: container.style.width,
            overflowX: getComputedStyle(container).overflowX,
            overflowY: getComputedStyle(container).overflowY,
          }
        },
        content: {
          clientWidth: content.clientWidth,
          scrollWidth: content.scrollWidth,
          offsetWidth: content.offsetWidth,
          style: {
            width: content.style.width,
          }
        },
        hasOverflow: container.scrollWidth > container.clientWidth,
        shouldShowScrollbar: container.scrollWidth > container.clientWidth
      };
      
      console.log('📏 Scroll Container Measurements:', measurements);
      setDebugInfo(measurements);
      
      // Force scrollbar visibility check
      if (container.scrollWidth <= container.clientWidth) {
        console.log('❌ NO OVERFLOW DETECTED - Content fits within container');
        console.log(`Content width: ${container.scrollWidth}px, Container width: ${container.clientWidth}px`);
      } else {
        console.log('✅ OVERFLOW DETECTED - Scrollbar should appear');
        console.log(`Content width: ${container.scrollWidth}px, Container width: ${container.clientWidth}px`);
      }
      
      return measurements;
    }
    return null;
  };

  // Initialize and handle parent resize
  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalDividerWidth = 8 * 2; // 8px per divider, 2 dividers
        const availableWidth = containerWidth - totalDividerWidth;
        const minTotalWidth = minWidthPx * 3; // 3 panels
        
        console.log('🔄 Updating widths:', {
          containerWidth,
          availableWidth,
          minTotalWidth
        });
        
        if (availableWidth >= minTotalWidth) {
          // Set initial widths: 20%, 20%, 60%
          const width1 = Math.max(availableWidth * 0.2, minWidthPx);
          const width2 = Math.max(availableWidth * 0.2, minWidthPx);
          const width3 = Math.max(availableWidth * 0.6, minWidthPx);
          
          // Ensure total doesn't exceed available width
          const totalWidth = width1 + width2 + width3;
          if (totalWidth > availableWidth) {
            // Proportionally reduce widths to fit
            const scale = availableWidth / totalWidth;
            setWidths([
              Math.max(width1 * scale, minWidthPx),
              Math.max(width2 * scale, minWidthPx),
              Math.max(width3 * scale, minWidthPx),
            ]);
          } else {
            setWidths([width1, width2, width3]);
          }
        } else {
          // Not enough space for all panels at minimum width
          setWidths([minWidthPx, minWidthPx, minWidthPx]);
        }
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, [minWidthPx]);

  // Measure scroll container when Panel 3 is extended or widths change
  useEffect(() => {
    if (widths.length > 0) {
      // Delay measurement to ensure DOM is updated
      setTimeout(() => {
        if (isPanel3Extended) {
          measureScrollContainer();
        }
      }, 100);
    }
  }, [isPanel3Extended, widths]);

  // Handle divider drag
  const onMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = index;
    console.log('🖱️ Started dragging divider:', index);
  };

  const onMouseMove = React.useCallback((e: MouseEvent) => {
    if (dragging.current === null || !containerRef.current) return;

    setWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      const index = dragging.current!;
      const deltaX = e.movementX;

      // Calculate new widths for the panels on either side of the divider
      const leftPanel = index;
      const rightPanel = index + 1;
      
      const newLeftWidth = newWidths[leftPanel] + deltaX;
      const newRightWidth = newWidths[rightPanel] - deltaX;

      // Check if both panels can maintain minimum width
      if (newLeftWidth >= minWidthPx && newRightWidth >= minWidthPx) {
        if (isPanel3Extended && index === 1) {
          // In extended mode, divider 1 (between Panel 2 & 3) should:
          // - Allow Panel 2 to resize
          // - Keep Panel 3 at its fixed extended width (4000px)
          // - Only resize Panel 2, don't touch Panel 3
          newWidths[leftPanel] = newLeftWidth; // Resize Panel 2
          // Don't change Panel 3 width - keep it at 4000px
          console.log('📏 Extended mode: Panel 2 resized to:', newLeftWidth, 'Panel 3 stays at:', newWidths[2]);
        } else {
          // Normal resizing for divider 0 (Panel 1 & 2) or when not in extended mode
          newWidths[leftPanel] = newLeftWidth;
          newWidths[rightPanel] = newRightWidth;
          console.log('📏 Panel widths updated:', newWidths);
        }
      }

      return newWidths;
    });
  }, [isPanel3Extended]);

  const onMouseUp = React.useCallback(() => {
    dragging.current = null;
    console.log('🖱️ Resizing stopped');
    
    // Re-measure after resize
    if (isPanel3Extended) {
      setTimeout(() => {
        measureScrollContainer();
      }, 50);
    }
  }, [isPanel3Extended]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const togglePanel3 = () => {
    console.log('🔄 Toggling Panel 3 from:', isPanel3Extended ? 'Extended' : 'Normal');
    setIsPanel3Extended(!isPanel3Extended);
    
    // Update Panel 3 width based on toggle state
    setWidths(prevWidths => {
      const newWidths = [...prevWidths];
      if (!isPanel3Extended) {
        // Switching to extended mode
        console.log('➡️ Switching to extended mode, setting Panel 3 width to 4000px');
        newWidths[2] = 4000;
      } else {
        // Switching back to normal mode
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const totalDividerWidth = 8 * 2;
          const availableWidth = containerWidth - totalDividerWidth;
          const remainingWidth = availableWidth - newWidths[0] - newWidths[1];
          newWidths[2] = Math.max(remainingWidth, minWidthPx);
          console.log('⬅️ Switching to normal mode, Panel 3 width:', newWidths[2]);
        }
      }
      console.log('📊 New widths after toggle:', newWidths);
      return newWidths;
    });
  };

  // Debug: Force scrollbar test
  const forceScrollbarTest = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      console.log('🧪 FORCE SCROLLBAR TEST');
      console.log('Before force:', {
        overflowX: getComputedStyle(container).overflowX,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth
      });
      
      // Force overflow-x scroll
      container.style.overflowX = 'scroll';
      container.style.overflowY = 'hidden';
      
      setTimeout(() => {
        console.log('After force:', {
          overflowX: getComputedStyle(container).overflowX,
          scrollWidth: container.scrollWidth,
          clientWidth: container.clientWidth
        });
        measureScrollContainer();
      }, 100);
    }
  };

  // Ensure widths are initialized before rendering
  if (widths.length === 0) {
    return (
      <div className="w-full h-screen overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-300">
          <div className="flex items-center justify-center">Loading...</div>
        </div>
        <div ref={containerRef} className="flex w-full h-full overflow-hidden">
          <div className="flex-1 flex items-center justify-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Toggle Button and Debug Info */}
      <div className="bg-gray-100 p-4 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePanel3}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isPanel3Extended
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Panel 3: {isPanel3Extended ? '4000px (Extended)' : 'Normal'}
          </button>
          
          {isPanel3Extended && (
            <div className="flex gap-2">
              <button
                onClick={measureScrollContainer}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              >
                Measure
              </button>
              <button
                onClick={forceScrollbarTest}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Force Scrollbar
              </button>
            </div>
          )}
        </div>
        
        {/* Debug Information Display */}
        {isPanel3Extended && debugInfo.container && (
          <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
            <strong>Debug Info:</strong><br/>
            Container: {debugInfo.container.clientWidth}px (client) | {debugInfo.container.scrollWidth}px (scroll)<br/>
            Content: {debugInfo.content?.offsetWidth}px (offset)<br/>
            Overflow: {debugInfo.hasOverflow ? '✅ YES' : '❌ NO'} | 
            OverflowX: {debugInfo.container.style.overflowX}<br/>
            Should show scrollbar: {debugInfo.shouldShowScrollbar ? 'YES' : 'NO'}
          </div>
        )}
      </div>

      {/* Panels Container */}
      <div ref={containerRef} className="flex w-full h-full overflow-hidden">
        {/* Panel 1 */}
        <div
          className="flex-shrink-0 flex items-center justify-center p-4 bg-red-200 overflow-auto transition-all duration-200"
          style={{ width: `${widths[0]}px`, minWidth: `${minWidthPx}px` }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Panel 1</h3>
            <p className="text-sm text-gray-600">Width: {Math.round(widths[0])}px</p>
          </div>
        </div>

        {/* Divider 1 */}
        <div
          className="w-2 bg-gray-300 cursor-col-resize hover:bg-blue-500 transition-colors duration-200 relative group flex-shrink-0"
          onMouseDown={onMouseDown(0)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-sm group-hover:bg-white"></div>
        </div>

        {/* Panel 2 */}
        <div
          className="flex-shrink-0 flex items-center justify-center p-4 bg-blue-200 overflow-auto transition-all duration-200"
          style={{ width: `${widths[1]}px`, minWidth: `${minWidthPx}px` }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Panel 2</h3>
            <p className="text-sm text-gray-600">Width: {Math.round(widths[1])}px</p>
          </div>
        </div>

        {/* Divider 2 */}
        <div
          className="w-2 bg-gray-300 cursor-col-resize hover:bg-blue-500 transition-colors duration-200 relative group flex-shrink-0"
          onMouseDown={onMouseDown(1)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-sm group-hover:bg-white"></div>
        </div>

        {/* Panel 3 */}
        <div
          className="bg-green-200 transition-all duration-200 flex-shrink-0"
          style={{ 
            width: `${widths[2]}px`,
            minWidth: `${minWidthPx}px`,
            height: '100%',
            position: 'relative'
          }}
        >
          {isPanel3Extended ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ padding: '16px', backgroundColor: '#bbf7d0', flexShrink: 0 }}>
                <h3 className="text-lg font-semibold mb-2 text-center">Panel 3</h3>
                <p className="text-sm text-gray-600 text-center">Panel Width: {Math.round(widths[2])}px</p>
                <p className="text-sm text-gray-600 text-center">Content Width: 1200px (Calendar)</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Extended Mode - Horizontal Scroll</p>
              </div>
              
              {/* Scrollable Content */}
              <div 
                ref={scrollContainerRef}
                className="force-horizontal-scroll"
                style={{
                  flex: 1,
                  width: `${Math.min(widths[2] - 32, 1000)}px`, // Increased for calendar
                  maxWidth: `${widths[2] - 32}px`,
                  padding: '16px',
                  boxSizing: 'border-box',
                  overflowX: 'scroll',
                  overflowY: 'hidden',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div 
                  ref={scrollContentRef}
                  className="calendar-container panel3-calendar"
                  style={{
                    width: '1200px', // Wide enough for calendar
                    minWidth: '1200px',
                    height: '600px', // Height for calendar
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '16px',
                    boxSizing: 'border-box',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                      📅 Project Calendar - Day Grid View
                    </h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                      Click dates to add events, click events to delete them
                    </p>
                  </div>
                  
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,dayGridWeek'
                    }}
                    events={calendarEvents}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    height="500px"
                    aspectRatio={1.8}
                    eventDisplay="block"
                    displayEventTime={false}
                    eventStartEditable={false}
                    eventDurationEditable={false}
                    droppable={false}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center h-full flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-2">Panel 3</h3>
              <p className="text-sm text-gray-600">Width: {Math.round(widths[2])}px</p>
              <p className="text-xs text-gray-500 mt-1">Normal Mode</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResizablePanels;