import { Tooltip, TooltipProps } from '@mui/material';
import PropTypes from 'prop-types';
import React, { ReactElement, ReactNode, RefObject, useEffect, useRef, useState } from 'react';

type ToolTipCustomProps = {
  title: ReactNode;
  scrollContainerRef: RefObject<HTMLElement | null>;
  children: ReactElement;
} & Omit<TooltipProps, 'title' | 'children'>;

export const VisibleOnScrollTooltip = ({
  title,
  scrollContainerRef,
  children,
  ...other
}: ToolTipCustomProps) => {
  const targetRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetElement = targetRef.current;
    const rootElement = scrollContainerRef.current;

    // Exit if the elements aren't rendered yet
    if (!targetElement || !rootElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state based on whether the element is intersecting
        setIsVisible(entry.isIntersecting);
      },
      {
        root: rootElement, // The scrollable parent
        rootMargin: '0px',
        threshold: 0.1, // Show when at least 10% of the element is visible
      }
    );

    // Start observing the target element
    observer.observe(targetElement);

    // Cleanup: disconnect the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
    // The dependency array ensures the effect runs again if the scroll container changes
  }, [scrollContainerRef]);

  // We use React.cloneElement to attach our ref to the child component
  const childWithRef = React.cloneElement(children, { ref: targetRef });

  return (
    <Tooltip
      title={title}
      arrow
      open={isVisible} // The key change: visibility is now controlled by state
      {...other}
    >
      {childWithRef}
    </Tooltip>
  );
};

VisibleOnScrollTooltip.propTypes = {
  title: PropTypes.node.isRequired,
  scrollContainerRef: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};
