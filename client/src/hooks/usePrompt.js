import { useCallback, useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

// React Router navigation blocking (internal links, buttons, etc.)
function useBlocker(blocker, when = true) {
  const navigator = useContext(NavigationContext)?.navigator;

  useEffect(() => {
    if (!when || !navigator?.block) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

// Full prompt hook — also adds beforeunload for browser back/reload
export function usePrompt(message, when) {
  const blocker = useCallback(
    (tx) => {
      if (window.confirm(message)) {
        tx.retry();
      }
    },
    [message]
  );

  useBlocker(blocker, when);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (when) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [when]);
}
