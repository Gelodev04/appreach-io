import { Tooltip, TooltipProps } from '@mui/material';
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
  const targetRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetElement = targetRef.current;
    const rootElement = scrollContainerRef.current;

    if (!targetElement || !rootElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: rootElement,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [scrollContainerRef]);

  const childWithRef = React.cloneElement(children, { ref: targetRef });

  return (
    <Tooltip title={title} arrow open={isVisible} {...other}>
      {childWithRef}
    </Tooltip>
  );
};
