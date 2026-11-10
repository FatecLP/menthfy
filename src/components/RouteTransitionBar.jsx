import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Top viewport progress indicator triggered by route changes and active database/API fetches.
 */
export default function RouteTransitionBar() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const networkCountRef = useRef(0);
  const rampTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const isFirstMount = useRef(true);

  function startBar() {
    clearTimeout(hideTimerRef.current);
    setVisible(true);
    setProgress(35);
    clearTimeout(rampTimerRef.current);
    rampTimerRef.current = setTimeout(() => {
      setProgress((prev) => (prev < 82 ? 82 : prev));
    }, 90);
  }

  function finishBar() {
    clearTimeout(rampTimerRef.current);
    setProgress(100);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
  }

  // Trigger on route pathname transitions
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return undefined;
    }

    startBar();
    const finishTimer = setTimeout(() => {
      if (networkCountRef.current === 0) {
        finishBar();
      }
    }, 260);

    return () => clearTimeout(finishTimer);
  }, [pathname]);

  // Trigger on active database/API network requests
  useEffect(() => {
    function handleNetworkLoading(event) {
      const count = event?.detail?.count ?? 0;
      networkCountRef.current = count;

      if (count > 0) {
        startBar();
      } else {
        finishBar();
      }
    }

    window.addEventListener('menthfy:network-loading', handleNetworkLoading);
    return () => {
      window.removeEventListener('menthfy:network-loading', handleNetworkLoading);
      clearTimeout(rampTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

