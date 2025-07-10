export const logDimensions = (
  calendarContainer: Element | null,
  wrapper: HTMLDivElement | null,
  fcElement: Element | null,
  fcScroller: Element | null,
  fcTimegridBody: Element | null,
  fcTimegridCols: Element | null,
  fcTimegridAxis: Element | null,
  panel3: HTMLDivElement | null,
  panel3Width: number,
  isZoom: boolean = false
) => {
  if (calendarContainer && wrapper && fcElement && fcScroller && fcTimegridBody && fcTimegridCols && fcTimegridAxis && panel3) {
    const htmlElement = calendarContainer as HTMLElement;
    const fcHtmlElement = fcElement as HTMLElement;
    const fcScrollerHtmlElement = fcScroller as HTMLElement;
    const fcTimegridBodyHtmlElement = fcTimegridBody as HTMLElement;
    const fcTimegridColsHtmlElement = fcTimegridCols as HTMLElement;
    const fcTimegridAxisHtmlElement = fcTimegridAxis as HTMLElement;
    const panel3HtmlElement = panel3 as HTMLElement;

    console.log(`📏 Calendar Debug${isZoom ? ' (After Zoom)' : ''}:`, {
      panel3Container: {
        clientWidth: panel3HtmlElement.clientWidth,
        scrollWidth: panel3HtmlElement.scrollWidth,
        offsetWidth: panel3HtmlElement.offsetWidth,
        computedOverflowX: getComputedStyle(panel3HtmlElement).overflowX,
        computedWidth: getComputedStyle(panel3HtmlElement).width
      },
      calendarContainer: {
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
      fcTimegridAxis: {
        clientWidth: fcTimegridAxisHtmlElement.clientWidth,
        scrollWidth: fcTimegridAxisHtmlElement.scrollWidth,
        offsetWidth: fcTimegridAxisHtmlElement.offsetWidth,
        computedWidth: getComputedStyle(fcTimegridAxisHtmlElement).width,
        computedMinWidth: getComputedStyle(fcTimegridAxisHtmlElement).minWidth,
        computedPosition: getComputedStyle(fcTimegridAxisHtmlElement).position,
        computedLeft: getComputedStyle(fcTimegridAxisHtmlElement).left,
        computedZIndex: getComputedStyle(fcTimegridAxisHtmlElement).zIndex
      },
      hasOverflow: htmlElement.scrollWidth > htmlElement.clientWidth,
      panel3Width
    });
  }
};