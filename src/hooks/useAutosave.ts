import { useEffect, useRef, useCallback } from 'react';

interface AutosaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  onStatusChange?: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
}

/**
 * Custom hook for auto-saving form data with debounce
 */
export const useAutosave = <T>(data: T, options: AutosaveOptions) => {
  const { delay = 800, onSave, onStatusChange } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);

  const debouncedSave = useCallback(async () => {
    if (onStatusChange) onStatusChange('saving');
    
    try {
      await onSave(data);
      if (onStatusChange) onStatusChange('saved');
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        if (onStatusChange) onStatusChange('idle');
      }, 2000);
    } catch (error) {
      console.error('Autosave error:', error);
      if (onStatusChange) onStatusChange('error');
    }
  }, [data, onSave, onStatusChange]);

  useEffect(() => {
    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(debouncedSave, delay);
    previousDataRef.current = data;

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, debouncedSave]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await debouncedSave();
  }, [debouncedSave]);

  return { saveNow };
};