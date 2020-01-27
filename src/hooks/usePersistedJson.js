import {useState, useEffect} from 'react';
import useLocalStorage from "./useLocalStorage";

export default (key, _initialValue = {}) => {
    const initialValue = () => JSON.stringify(typeof _initialValue === "function" ? _initialValue() : _initialValue);
    const [persistedValue, persistValue] = useLocalStorage(key, initialValue);
    const [value, setValue] = useState(JSON.parse(persistedValue));

    useEffect(() => {
        console.log('[usePersistedJson] calling persistValue');
        persistValue(JSON.stringify(value));
    }, [key, value, persistValue]);

     return [value, setValue];
}
