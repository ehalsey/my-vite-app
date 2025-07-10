import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useRef, useState } from 'react';

const ResizablePanels: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);
  const calendarNormalRef = useRef<FullCalendar>(null);
  const calendarExtendedRef = useRef<FullCalendar>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const minWidthPx = 100;
  const [widths, setWidths] = useState<number[]>([]);
  const [isPanel3Extended, setIsPanel3Extended] = useState(false);

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
      const extendedContainer = containerRef.current?.querySelector('#panel3-extended');
      const wrapper = calendarWrapperRef.current;
      const fcElement = extendedContainer?.querySelector('.fc');
      const fcScroller = extendedContainer?.querySelector('.fc-scroller');
      const fcTimegridBody = extendedContainer?.querySelector('.fc-timegrid-body');
      const fcTimegridCols = extendedContainer?.querySelector('.fc-timegrid-cols');
      const panel3 = panel3Ref.current;

      const logDimensions = () => {
        if (extendedContainer && wrapper && fcElement && fcScroller && fcTimegridBody && fcTimegridCols && panel3) {
          const htmlElement = extendedContainer as HTMLElement;
          const fcHtmlElement = fcElement as HTMLElement;
          const fcScrollerHtmlElement = fcScroller as HTMLElement;
          const fcTimegridBodyHtmlElement = fcTimegridBody as HTMLElement;
          const fcTimegridColsHtmlElement = fcTimegridCols as HTMLElement;
          const panel3HtmlElement = panel3 as HTMLElement;
          console.log('📏 Extended Mode Debug:', {
            panel3Container: {
              clientWidth: panel3HtmlElement.clientWidth,
              scrollWidth: panel3HtmlElement.scrollWidth,
              offsetWidth: panel3HtmlElement.offsetWidth,
              computedOverflowX: getComputedStyle(panel3HtmlElement).overflowX,
              computedWidth: getComputedStyle(panel3HtmlElement).width
            },
            extendedContainer: {
              clientWidth: htmlElement.clientWidth,
              scrollWidth: htmlElement.scrollWidth,
              offsetWidth: htmlElement.offsetWidth,
              computedOverflowX: getComputedStyle(htmlElement).overflowX,
              computedWidth: getComputedStyle(htmlElement).width
            },
            wrapper: {
              clientWidth: wrapper.clientWidth,
              scrollWidth: wrapper.scrollWidth,
              offsetWidth: wrapper.offsetWidth,
              computedWidth: getComputedStyle(wrapper).width,
              computedMinWidth: getComputedStyle(wrapper).minWidth
            },
            fullCalendar: {
              clientWidth: fcHtmlElement.clientWidth,
              scrollWidth: fcHtmlElement.scrollWidth,
              offsetWidth: fcHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcHtmlElement).width,
              computedMinWidth: getComputedStyle(fcHtmlElement).minWidth
            },
            fcScroller: {
              clientWidth: fcScrollerHtmlElement.clientWidth,
              scrollWidth: fcScrollerHtmlElement.scrollWidth,
              offsetWidth: fcScrollerHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcScrollerHtmlElement).width,
              computedMinWidth: getComputedStyle(fcScrollerHtmlElement).minWidth
            },
            fcTimegridBody: {
              clientWidth: fcTimegridBodyHtmlElement.clientWidth,
              scrollWidth: fcTimegridBodyHtmlElement.scrollWidth,
              offsetWidth: fcTimegridBodyHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcTimegridBodyHtmlElement).width,
              computedMinWidth: getComputedStyle(fcTimegridBodyHtmlElement).minWidth
            },
            fcTimegridCols: {
              clientWidth: fcTimegridColsHtmlElement.clientWidth,
              scrollWidth: fcTimegridColsHtmlElement.scrollWidth,
              offsetWidth: fcTimegridColsHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcTimegridColsHtmlElement).width,
              computedMinWidth: getComputedStyle(fcTimegridColsHtmlElement).minWidth
            },
            hasOverflow: htmlElement.scrollWidth > htmlElement.clientWidth,
            panel3Width: widths[2]
          });
        }
      };

      // Initial render
      calendarExtendedRef.current?.getApi().updateSize();
      logDimensions();

      // Force reflow
      requestAnimationFrame(() => {
        if (extendedContainer) {
          extendedContainer.style.display = 'none';
          extendedContainer.style.display = 'block';
          extendedContainer.scrollLeft = 0;
          logDimensions();
        }
      });
    } else if (!isPanel3Extended && calendarNormalRef.current) {
      setTimeout(() => {
        calendarNormalRef.current?.getApi().updateSize();
        const normalContainer = containerRef.current?.querySelector('#panel3-normal');
        if (normalContainer) {
          const htmlElement = normalContainer as HTMLElement;
          console.log('📏 Normal Container Dimensions:', {
            clientWidth: htmlElement.clientWidth,
            scrollWidth: htmlElement.scrollWidth,
            offsetWidth: htmlElement.offsetWidth,
            computedWidth: getComputedStyle(htmlElement).width,
            hasOverflow: htmlElement.scrollWidth > htmlElement.clientWidth
          });
        }
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
        calendarExtendedRef.current?.getApi().updateSize();
        const extendedContainer = containerRef.current?.querySelector('#panel3-extended');
        if (extendedContainer) {
          extendedContainer.style.display = 'none';
          extendedContainer.style.display = 'block';
          extendedContainer.scrollLeft = 0;
        }
      }, 50);
    } else if (calendarNormalRef.current) {
      calendarNormalRef.current?.getApi().updateSize();
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
        extendedContainer.style.display = 'none';
        extendedContainer.style.display = 'block';
        extendedContainer.scrollLeft = 0;
      });
      resizeObserver.observe(extendedContainer);
      return () => resizeObserver.disconnect();
    }
  }, [isPanel3Extended]);

  // Log dimensions on zoom change
  useEffect(() => {
    const handleZoomChange = () => {
      if (isPanel3Extended && calendarExtendedRef.current) {
        const extendedContainer = containerRef.current?.querySelector('#panel3-extended');
        const wrapper = calendarWrapperRef.current;
        const fcElement = extendedContainer?.querySelector('.fc');
        const fcScroller = extendedContainer?.querySelector('.fc-scroller');
        const fcTimegridBody = extendedContainer?.querySelector('.fc-timegrid-body');
        const fcTimegridCols = extendedContainer?.querySelector('.fc-timegrid-cols');
        const panel3 = panel3Ref.current;

        if (extendedContainer && wrapper && fcElement && fcScroller && fcTimegridBody && fcTimegridCols && panel3) {
          const htmlElement = extendedContainer as HTMLElement;
          const fcHtmlElement = fcElement as HTMLElement;
          const fcScrollerHtmlElement = fcScroller as HTMLElement;
          const fcTimegridBodyHtmlElement = fcTimegridBody as HTMLElement;
          const fcTimegridColsHtmlElement = fcTimegridCols as HTMLElement;
          const panel3HtmlElement = panel3 as HTMLElement;
          console.log('📏 Extended Mode Debug (After Zoom):', {
            panel3Container: {
              clientWidth: panel3HtmlElement.clientWidth,
              scrollWidth: panel3HtmlElement.scrollWidth,
              offsetWidth: panel3HtmlElement.offsetWidth,
              computedOverflowX: getComputedStyle(panel3HtmlElement).overflowX,
              computedWidth: getComputedStyle(panel3HtmlElement).width
            },
            extendedContainer: {
              clientWidth: htmlElement.clientWidth,
              scrollWidth: htmlElement.scrollWidth,
              offsetWidth: htmlElement.offsetWidth,
              computedOverflowX: getComputedStyle(htmlElement).overflowX,
              computedWidth: getComputedStyle(htmlElement).width
            },
            wrapper: {
              clientWidth: wrapper.clientWidth,
              scrollWidth: wrapper.scrollWidth,
              offsetWidth: wrapper.offsetWidth,
              computedWidth: getComputedStyle(wrapper).width,
              computedMinWidth: getComputedStyle(wrapper).minWidth
            },
            fullCalendar: {
              clientWidth: fcHtmlElement.clientWidth,
              scrollWidth: fcHtmlElement.scrollWidth,
              offsetWidth: fcHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcHtmlElement).width,
              computedMinWidth: getComputedStyle(fcHtmlElement).minWidth
            },
            fcScroller: {
              clientWidth: fcScrollerHtmlElement.clientWidth,
              scrollWidth: fcScrollerHtmlElement.scrollWidth,
              offsetWidth: fcScrollerHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcScrollerHtmlElement).width,
              computedMinWidth: getComputedStyle(fcScrollerHtmlElement).minWidth
            },
            fcTimegridBody: {
              clientWidth: fcTimegridBodyHtmlElement.clientWidth,
              scrollWidth: fcTimegridBodyHtmlElement.scrollWidth,
              offsetWidth: fcTimegridBodyHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcTimegridBodyHtmlElement).width,
              computedMinWidth: getComputedStyle(fcTimegridBodyHtmlElement).minWidth
            },
            fcTimegridCols: {
              clientWidth: fcTimegridColsHtmlElement.clientWidth,
              scrollWidth: fcTimegridColsHtmlElement.scrollWidth,
              offsetWidth: fcTimegridColsHtmlElement.offsetWidth,
              computedWidth: getComputedStyle(fcTimegridColsHtmlElement).width,
              computedMinWidth: getComputedStyle(fcTimegridColsHtmlElement).minWidth
            },
            hasOverflow: htmlElement.scrollWidth > htmlElement.clientWidth,
            panel3Width: widths[2]
          });
        }
      }
    };

    window.addEventListener('resize', handleZoomChange);
    return () => window.removeEventListener('resize', handleZoomChange);
  }, [isPanel3Extended, widths]);

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
      <style>
        {`
          .fc-normal .fc {
            width: 100% !important;
            min-width: 0 !important;
          }
          .fc-extended .fc {
            width: 4000px !important;
            min-width: 4000px !important;
          }
          .fc-extended {
            overflow-x: scroll !important;
          }
          .fc-scroller {
            width: 4000px !important;
            min-width: 4000px !important;
            overflow: visible !important;
          }
          .fc-timegrid-body {
            width: 4000px !important;
            min-width: 4000px !important;
          }
          .fc-timegrid-slots {
            width: 4000px !important;
            min-width: 4000px !important;
          }
          .fc-timegrid-cols {
            width: 4000px !important;
            min-width: 4000px !important;
          }
          .fc-timegrid-axis {
            position: sticky !important;
            left: 0 !important;
            z-index: 3 !important;
          }
        `}
      </style>
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
          {isPanel3Extended ? (
            <div
              id="panel3-extended"
              className="fc-extended"
              style={{
                width: `${widths[2]}px`,
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
                  ref={calendarExtendedRef}
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={[
                    { title: 'Event 1', date: '2025-07-06T09:00:00', duration: '01:00' }, // Sunday
                    { title: 'Event 2', date: '2025-07-07T14:00:00', duration: '01:30' }, // Monday
                    { title: 'Event 3', date: '2025-07-08T10:00:00', duration: '01:00' }, // Tuesday
                    { title: 'Event 4', date: '2025-07-09T15:00:00', duration: '01:30' }, // Wednesday
                    { title: 'Event 5', date: '2025-07-10T11:00:00', duration: '01:00' }, // Thursday
                    { title: 'Event 6', date: '2025-07-11T16:00:00', duration: '01:30' }, // Friday
                    { title: 'Event 7', date: '2025-07-12T12:00:00', duration: '01:00' }  // Saturday
                  ]}
                  height="100%"
                  contentHeight="auto"
                  slotMinTime="08:00:00"
                  slotMaxTime="18:00:00"
                  slotDuration="00:30:00"
                  allDaySlot={false}
                  dayMinWidth={500} // Ensure each day is at least 500px
                />
              </div>
            </div>
          ) : (
            <div
              id="panel3-normal"
              className="fc-normal"
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              >
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
                  contentHeight="auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResizablePanels;