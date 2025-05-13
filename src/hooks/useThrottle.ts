import { useRef } from "react";

const useThrottle = (callback: () => void, delayInMS: number) => {
  const lastCalled = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return () => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCalled.current;

    if (timeSinceLastCall >= delayInMS) {
      lastCalled.current = now;
      callback();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lastCalled.current = Date.now();
        callback();
      }, delayInMS - timeSinceLastCall);
    }
  };
};

export default useThrottle;
