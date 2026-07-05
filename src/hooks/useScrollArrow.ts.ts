import { useState, useEffect, RefObject } from 'react';

export function useScrollArrow(containerRef: RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const canScrollDown = container.scrollHeight > container.clientHeight &&
        container.scrollTop < container.scrollHeight - container.clientHeight - 20;
      setIsVisible(canScrollDown);
    };

    // Check initially
    checkScroll();

    // Check on scroll
    container.addEventListener('scroll', checkScroll);

    // Check on resize
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [containerRef]);

  return { isVisible };
}