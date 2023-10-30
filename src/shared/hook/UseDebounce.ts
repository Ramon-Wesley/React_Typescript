import { useCallback, useRef } from "react";

export const UseDebounce = (delay = 1000, isFirst = false) => {
  const isFirstResult = useRef(isFirst);
  const debouncing = useRef<NodeJS.Timeout>();

  const debounce = useCallback(
    (func: () => void) => {
      if (isFirstResult.current) {
        isFirstResult.current = false;
        func();
      } else {
        if (debouncing.current) {
          clearTimeout(debouncing.current);
        }
        debouncing.current = setTimeout(() => {
          func();
        }, delay);
      }
    },
    [delay]
  );

  return { debounce };
};
