import { useState, useEffect, useMemo } from "react";

export default function useStateAsyncInit<T>(init: () => T) {
  const initialValue = useMemo(init, []);
  const [state, setState] = useState<T>(initialValue);

  return [state, setState] as [T, React.Dispatch<React.SetStateAction<T>>];
}
