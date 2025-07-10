import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import scrollGridPlugin from '@fullcalendar/scrollgrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useRef, useState } from 'react';
import { events } from './events';
import './index.css';
import { logDimensions } from './logger';

const ResizablePanels: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const minWidthPx = 100;
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    const updateWidths = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const totalDividerWidth = 8 * 2;
        const availableWidth = containerWidth - totalDividerWidth;
        const minTotalWidth = minWidthPx * 3;

        if (availableWidth >= minTotalWidth) {
          const width1 = Math.max(availableWidth * 0.2, minWidthPx);
          const width2 = Math.max(availableWidth * 0.2, minWidthPx);
          const width3 = Math.max(availableWidth - width1 - width2, minWidthPx);

          setWidths([width1, width2, width3]);
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
    if (widths.length > 0 && calendarRef.current) {
      const calendarContainer = containerRef.current?.querySelector('#calendar-container') ?? null;
      const wrapper = calendarWrapperRef.current ?? null;
      const fcElement = calendarContainer?.querySelector('.fc') ?? null;
      const fcScroller = calendarContainer?.querySelector('.fc-scroller') ?? null;
      const fcTimegridBody = calendarContainer?.querySelector('.fc-timegrid-body') ?? null;
      const fcTimegridCols = calendarContainer?.querySelector('.fc-timegrid-cols') ?? null;
      const fcTimegridAxis = calendarContainer?.querySelector('.fc-timegrid-axis') ?? null;
      const panel3 = panel3Ref.current ?? null;

      // Initial render
      calendarRef.current?.getApi().updateSize();
      logDimensions(calendarContainer, wrapper, fcElement, fcScroller, fcTimegridBody, fcTimegridCols, fcTimegridAxis, panel3, widths[2]);

      // Force reflow
      requestAnimationFrame(() => {
        if (calendarContainer) {
          const htmlElement = calendarContainer as HTMLElement;
          htmlElement.style.display = 'none';
          htmlElement.style.display = 'block';
          htmlElement.scrollLeft = 0;
          logDimensions(calendarContainer, wrapper, fcElement, fcScroller, fcTimegridBody, fcTimegridCols, fcTimegridAxis, panel3, widths[2]);
        }
      });
    }
  }, [widths]);

  const onMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = index;
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
        newWidths[leftPanel] = newLeftWidth;
        newWidths[rightPanel] = newRightWidth;
      }

      return newWidths;
    });
  }, [minWidthPx]);

  const onMouseUp = React.useCallback(() => {
    dragging.current = null;

    if (calendarRef.current) {
      setTimeout(() => {
        calendarRef.current?.getApi().updateSize();
        const calendarContainer = containerRef.current?.querySelector('#calendar-container') ?? null;
        if (calendarContainer) {
          const htmlElement = calendarContainer as HTMLElement;
          htmlElement.style.display = 'none';
          htmlElement.style.display = 'block';
          htmlElement.scrollLeft = 0;
        }
      }, 50);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  useEffect(() => {
    const calendarContainer = containerRef.current?.querySelector('#calendar-container') ?? null;
    if (calendarContainer && calendarRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calendarRef.current?.getApi().updateSize();
        if (calendarContainer) {
          const htmlElement = calendarContainer as HTMLElement;
          htmlElement.style.display = 'none';
          htmlElement.style.display = 'block';
          htmlElement.scrollLeft = 0;
        }
      });
      resizeObserver.observe(calendarContainer);
      return () => resizeObserver.disconnect();
    }
  }, [widths]);

  // Handle zoom change
  useEffect(() => {
    const handleZoomChange = () => {
      if (calendarRef.current) {
        const calendarContainer = containerRef.current?.querySelector('#calendar-container') ?? null;
        const wrapper = calendarWrapperRef.current ?? null;
        const fcElement = calendarContainer?.querySelector('.fc') ?? null;
        const fcScroller = calendarContainer?.querySelector('.fc-scroller') ?? null;
        const fcTimegridBody = calendarContainer?.querySelector('.fc-timegrid-body') ?? null;
        const fcTimegridCols = calendarContainer?.querySelector('.fc-timegrid-cols') ?? null;
        const fcTimegridAxis = calendarContainer?.querySelector('.fc-timegrid-axis') ?? null;
        const panel3 = panel3Ref.current ?? null;

        logDimensions(calendarContainer, wrapper, fcElement, fcScroller, fcTimegridBody, fcTimegridCols, fcTimegridAxis, panel3, widths[2], true);
      }
    };

    window.addEventListener('resize', handleZoomChange);
    return () => window.removeEventListener('resize', handleZoomChange);
  }, [widths]);

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
          <h1 className="text-lg font-semibold">Provider Schedule</h1>
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
          ref={panel3Ref}
          className="bg-green-200 transition-all duration-200 flex-shrink-0"
          style={{
            width: `${widths[2]}px`,
            minWidth: `${minWidthPx}px`,
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            id="calendar-container"
            className="fc-container"
            style={{
              width: '100%',
              minWidth: '4000px',
              height: '100%',
              backgroundColor: '#bbf7d0',
              overflowX: 'scroll',
              overflowY: 'hidden'
            }}
          >
            <div
              ref={calendarWrapperRef}
              style={{
                width: '4000px',
                minWidth: '4000px',
                height: '100%',
                display: 'block',
                overflow: 'visible'
              }}
            >
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, scrollGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                events={events}
                schedulerLicenseKey="0070982010-fcs-1750820052"
                height="100%"
                contentHeight="auto"
                slotMinTime="08:00:00"
                slotMaxTime="18:00:00"
                slotDuration="00:30:00"
                allDaySlot={false}
                dayMinWidth={500}
                stickyHeaderDates={true}
                eventContent={(arg) => (
                  <div>
                    <b>{arg.event.title}</b>
                    <p>{arg.event.extendedProps.providerId}</p>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizablePanels;