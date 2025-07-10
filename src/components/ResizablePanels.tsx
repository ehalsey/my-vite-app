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
  const minWidthPx = 100; // Minimum width in pixels

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
  }, []);

  // Measure scroll container when Panel 3 is extended
  useEffect(() => {
    if (isPanel3Extended && widths.length > 0) {
      // Delay measurement to ensure DOM is updated
      setTimeout(() => {
        measureScrollContainer();
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
          // In extended mode, don't allow resizing between Panel 2 and Panel 3
          console.log('🚫 Blocked resize of Panel 3 in extended mode');
          return newWidths;
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
                <p className="text-sm text-gray-600 text-center">Content Width: 3000px</p>
                <p className="text-xs text-gray-500 mt-1 text-center">Extended Mode - Horizontal Scroll</p>
              </div>
              
              {/* Scrollable Content */}
              <div 
                ref={scrollContainerRef}
                className="force-horizontal-scroll"
                style={{
                  flex: 1,
                  width: '100%',
                  padding: '16px',
                  boxSizing: 'border-box',
                  // Force scrollbar with inline styles
                  overflowX: 'scroll',
                  overflowY: 'hidden',
                  backgroundColor: '#f0f9ff'
                }}
              >
                <div 
                  ref={scrollContentRef}
                  style={{
                    width: '3000px',
                    height: '200px',
                    backgroundColor: '#86efac',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    boxSizing: 'border-box',
                    minWidth: '3000px' // Ensure minimum width
                  }}
                >
                  {Array.from({ length: 8 }, (_, i) => (
                    <div 
                      key={i}
                      style={{
                        width: '300px',
                        height: '120px',
                        backgroundColor: '#4ade80',
                        borderRadius: '8px',
                        padding: '16px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexShrink: 0,
                        minWidth: '300px' // Prevent shrinking
                      }}
                    >
                      <strong>Block {i + 1}</strong>
                      <span style={{ fontSize: '12px', marginTop: '8px' }}>
                        Wide content block - should show horizontal scroll
                      </span>
                    </div>
                  ))}
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