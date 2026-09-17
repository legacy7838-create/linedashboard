'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * no further changes. Used to keep expensive derivations from running on
 * every keystroke in the filter search box.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Skip the delay on mount so the initial value is available immediately.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
