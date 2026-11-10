import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position to the top whenever the active route pathname changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

