import {useState, useEffect} from 'react';

export default (key, initialValue = "") => {
  const [value, setValue] = useState(() => {
    initialValue = (typeof initialValue === "function" ? initialValue() : initialValue);
    return localStorage.getItem(key) || initialValue;
  });

  useEffect(() => {
    console.log('[useLocalStorage] calling localStorage.setItem');
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
