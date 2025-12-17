import { useState, useEffect, useCallback } from 'react';

export function usePersistence<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Reload from storage when key changes
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error(error);
            setStoredValue(initialValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Need to handle functional update based on *current* state if possible, but 
            // since this is a custom hook wrapper around useState, we can use the setStoredValue callback form
            // wrapped in our own logic? 
            // Actually, we can just use setStoredValue(prev => ...) but we need to compute the new value for localStorage.

            setStoredValue(prevStoredValue => {
                const valueToStore = value instanceof Function ? value(prevStoredValue) : value;

                // Write to localStorage in a separate try-catch to ensure errors are caught
                try {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                } catch (storageError) {
                    console.error('Failed to write to localStorage:', storageError);
                    // Continue with state update even if storage fails
                }

                return valueToStore;
            });
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    return [storedValue, setValue] as const;
}
