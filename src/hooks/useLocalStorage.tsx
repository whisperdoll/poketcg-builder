import { isFunction } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue?: T) {
  const getStorageValue = useCallback(() => {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value) as T;
    } else {
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
  }, [localStorage, key, initialValue]);

  const setStorageValue = useCallback((value: T | ((oldValue?: T) => T)) => {
    const resolvedValue = isFunction(value) ? value(getStorageValue()) : value;
    localStorage.setItem(key, JSON.stringify(resolvedValue));
    setValue(resolvedValue);
  }, []);

  const [value, setValue] = useState<T | undefined>(getStorageValue());

  useEffect(() => {
    const onStorage = () => setValue(getStorageValue());

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, [setValue, getStorageValue]);

  return [value, setStorageValue] as [
    T | undefined,
    (value: T | ((oldValue?: T) => T)) => void,
  ];
}
