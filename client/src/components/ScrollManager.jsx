// src/components/ScrollManager.jsx
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollManager() {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  // Turn off native auto-restoration so we only restore on POP
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // On back/forward (POP), do nothing → browser restores position
    if (navType === 'POP') return;

    // On any other navigation (LINK click or navigate()), scroll to top
    window.scrollTo(0, 0);
  }, [pathname, navType]);

  return null;
}
