import { useEffect } from 'react';
import { getScrollbarSize } from 'src/utils';

export const useStickyPinnedColumn = (pinnedIndex: number = 13) => {
  useEffect(() => {
    let scrollerListenerCleanup: (() => void) | null = null;
    let resizeObserverCleanup: (() => void) | null = null;
    let findScrollerTimeoutId: NodeJS.Timeout | null = null;

    const setupInteractions = (virtualScrollerElement: Element) => {
      const pinnedHeader = document.querySelector(
        `.MuiDataGrid-columnHeader:nth-child(${pinnedIndex + 1})`
      ) as HTMLElement | null;

      const updatePinnedHeaderRightOffset = () => {
        if (pinnedHeader && virtualScrollerElement) {
          const hasScrollbar =
            virtualScrollerElement.scrollHeight > virtualScrollerElement.clientHeight;
          const scrollbarWidth = hasScrollbar ? getScrollbarSize(document) : 0;
          pinnedHeader.style.right = `${scrollbarWidth}px`;
        }
      };

      updatePinnedHeaderRightOffset();

      const observer = new ResizeObserver(updatePinnedHeaderRightOffset);
      observer.observe(virtualScrollerElement);
      window.addEventListener('resize', updatePinnedHeaderRightOffset);

      resizeObserverCleanup = () => {
        observer.disconnect();
        window.removeEventListener('resize', updatePinnedHeaderRightOffset);
        if (pinnedHeader) pinnedHeader.style.right = '0px';
      };

      const handleScrollHorizontal = () => {
        const { scrollLeft } = virtualScrollerElement;
        const headers = document.querySelectorAll('.MuiDataGrid-columnHeader');
        headers.forEach((header, index) => {
          const el = header as HTMLElement;
          if (index === pinnedIndex) {
            el.style.transform = 'none';
          } else {
            el.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
          }
        });
      };

      virtualScrollerElement.addEventListener('scroll', handleScrollHorizontal);
      scrollerListenerCleanup = () => {
        virtualScrollerElement.removeEventListener('scroll', handleScrollHorizontal);
      };
    };

    const findScroller = () => {
      const scroller = document.querySelector('.MuiDataGrid-virtualScroller');
      if (!scroller) {
        findScrollerTimeoutId = setTimeout(findScroller, 100);
      } else {
        setupInteractions(scroller);
      }
    };

    findScroller();

    return () => {
      if (findScrollerTimeoutId) clearTimeout(findScrollerTimeoutId);
      if (scrollerListenerCleanup) scrollerListenerCleanup();
      if (resizeObserverCleanup) resizeObserverCleanup();
    };
  }, [pinnedIndex]);
};
