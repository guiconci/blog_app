// hooks/usePrompt.js
import { useEffect, useRef } from "react";

export function usePrompt(message, when) {
  const handlerRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (!when) return;
      e.preventDefault();
      e.returnValue = message;
    };
    handlerRef.current = handler;
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [message, when]);

  // expose a kill switch
  return () => {
    if (handlerRef.current) {
      window.removeEventListener("beforeunload", handlerRef.current);
      handlerRef.current = null;
    }
  };
}
