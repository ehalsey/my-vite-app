import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useRef, useState } from 'react';

const ResizablePanels: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);
  const calendarNormalRef = useRef<FullCalendar>(null);
  const calendarExtendedRef = useRef<FullCalendar>(null);
  const [widths, setWidths] = useState<number[]>([]);
  const [isPanel3Extended, setIsPanel3Extended] = useState(false);
  const minWidthPx = 100;

  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalDividerWidth = 8 * 2;
        const availableWidth = containerWidth - totalDividerWidth;
        const minTotalWidth = minWidthPx * 3;
        
        console.log('🔄 Updating widths:', {
          containerWidth,
          availableWidth,
          minTotalWidth
        });
        
        if (availableWidth >= minTotalWidth) {
          const width1 = Math.max(availableWidth * 0.2, minWidthPx);
          const width2 = Math.max(availableWidth * 0.2, minWidthPx);
          const width3 = Math.max(availableWidth * 0.6, minWidthPx);
          
          const totalWidth = width1 + width2 + width3;
          if (totalWidth > availableWidth) {
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
          setWidths([minWidthPx, minWidthPx, minWidthPx]);
        }
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  useEffect(() => {
    if (isPanel3Extended && widths.length > 0 && calendarExtendedRef.current) {
      setTimeout(() => {
        calendarExtendedRef.current.getApi().updateSize();
      }, 100);
    }
  }, [isPanel3Extended, widths]);

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

      const leftPanel = index;
      const rightPanel = index + 1;
      
      const newLeftWidth = newWidths[leftPanel] + deltaX;
      const newRightWidth = newWidths[rightPanel] - deltaX;

      if (newLeftWidth >= minWidthPx && newRightWidth >= minWidthPx) {
        if (isPanel3Extended && index === 1) {
          newWidths[leftPanel] = newLeftWidth;
          console.log('📏 Extended mode: Panel 2 resized to:', newLeftWidth, 'Panel 3 stays at:', newWidths[2]);
        } else {
          newWidths[leftPanel] = newLeftWidth;
          newWidths[rightPanel] = newRightWidth;
          console.log('📏 Panel widths updated:', newWidths);
        }
      }

      return newWidths;
    });
  }, [isPanel3Extended, minWidthPx]);

  const onMouseUp = React.useCallback(() => {
    dragging.current = null;
    console.log('🖱️ Resizing stopped');
    
    if (isPanel3Extended && calendarExtendedRef.current) {
      setTimeout(() => {
        calendarExtendedRef.current.getApi().updateSize();
      }, 50);
    } else if (calendarNormalRef.current) {
      calendarNormalRef.current.getApi().updateSize();
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
    
    setWidths(prevWidths => {
      const newWidths = [...prevWidths];
      if (!isPanel3Extended) {
        console.log('➡️ Switching to extended mode, setting Panel 3 width to 4000px');
        newWidths[2] = 4000;
      } else {
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

  useEffect(() => {
    const normalContainer = containerRef.current?.querySelector('#panel3-normal');
    if (normalContainer && calendarNormalRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calendarNormalRef.current?.getApi().updateSize();
      });
      resizeObserver.observe(normalContainer);
      return () => resizeObserver.disconnect();
    }
  }, [isPanel3Extended]);

  useEffect(() => {
    const extendedContainer = containerRef.current?.querySelector('#panel3-extended');
    if (extendedContainer && calendarExtendedRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calendarExtendedRef.current?.getApi().updateSize();
      });
      resizeObserver.observe(extendedContainer);
      return () => resizeObserver.disconnect();
    }
  }, [isPanel3Extended]);

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
        </div>
      </div>

      <div ref={containerRef} className="flex w-full h-full overflow-hidden">
        <div
          className="flex-shrink-0 flex items-center justify-center p-4 bg-red-200 overflow-auto transition-all duration-200"
          style={{ width: `${widths[0]}px`, minWidth: `${minWidthPx}px` }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Panel 1</h3>
            <p className="text-sm text-gray-600">Width: {Math.round(widths[0])}px</p>
          </div>
        </div>

        <div
          className="w-2 bg-gray-300 cursor-col-resize hover:bg-blue-500 transition-colors duration-200 relative group flex-shrink-0"
          onMouseDown={onMouseDown(0)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-sm group-hover:bg-white"></div>
        </div>

        <div
          className="flex-shrink-0 flex items-center justify-center p-4 bg-blue-200 overflow-auto transition-all duration-200"
          style={{ width: `${widths[1]}px`, minWidth: `${minWidthPx}px` }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Panel 2</h3>
            <p className="text-sm text-gray-600">Width: {Math.round(widths[1])}px</p>
          </div>
        </div>

        <div
          className="w-2 bg-gray-300 cursor-col-resize hover:bg-blue-500 transition-colors duration-200 relative group flex-shrink-0"
          onMouseDown={onMouseDown(1)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-sm group-hover:bg-white"></div>
        </div>

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
            <div
              id="panel3-extended"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#bbf7d0',
                overflowX: 'auto',
                overflowY: 'hidden'
              }}
            >
              <div style={{ minWidth: '4000px', height: '100%' }}>
                <FullCalendar
                  ref={calendarExtendedRef}
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={[
                    { title: 'Event 1', date: '2025-07-10' },
                    { title: 'Event 2', date: '2025-07-15' }
                  ]}
                  height="100%"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 h-full" id="panel3-normal">
              <FullCalendar
                ref={calendarNormalRef}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={[
                  { title: 'Event 1', date: '2025-07-10' },
                  { title: 'Event 2', date: '2025-07-15' }
                ]}
                height="100%"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResizablePanels;