import { useEffect, useRef } from "react";

// Returns the previous value of any state variable
export default function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
