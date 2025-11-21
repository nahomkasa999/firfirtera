'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Picker from 'react-mobile-picker';
import './TimePicker.css';

interface TimePickerComponentProps {
  value: string;
  onChange: (value: string) => void;
  format?: '12' | '24';
  disabled?: boolean;
  className?: string;
}

export function TimePickerComponent({ 
  value, 
  onChange, 
  format = '24', 
  disabled = false, 
  className = '' 
}: TimePickerComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Parse current value
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (format === '12') {
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return { hour: hour12, minute: minutes || 0, period };
    } else {
      return { hour: hours || 12, minute: minutes || 0, period: 'AM' };
    }
  };

  const initialTime = parseTime(value);
  const [pickerValue, setPickerValue] = useState({
    hour: initialTime.hour.toString().padStart(2, '0'),
    minute: initialTime.minute.toString().padStart(2, '0'),
    ...(format === '12' && { period: initialTime.period }),
  });

  useEffect(() => {
    const parsed = parseTime(value);
    setPickerValue({
      hour: parsed.hour.toString().padStart(2, '0'),
      minute: parsed.minute.toString().padStart(2, '0'),
      ...(format === '12' && { period: parsed.period }),
    });
  }, [value, format]);

  // Generate options
  const hourOptions = useMemo(() => {
    if (format === '12') {
      return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    } else {
      return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    }
  }, [format]);

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  }, []);

  const periodOptions = ['AM', 'PM'];

  const optionGroups = useMemo(() => {
    const groups: Record<string, string[]> = {
      hour: hourOptions,
      minute: minuteOptions,
    };
    if (format === '12') {
      groups.period = periodOptions;
    }
    return groups;
  }, [hourOptions, minuteOptions, format]);

  const handleChange = (newValue: typeof pickerValue) => {
    setPickerValue(newValue);
    
    // Convert to HH:mm format
    let hour24 = parseInt(newValue.hour);
    if (format === '12') {
      if (newValue.period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (newValue.period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${newValue.minute}`;
    onChange(timeString);
  };

  // Format display value
  const displayValue = useMemo(() => {
    if (!value) return '';
    const [hours, minutes] = value.split(':').map(Number);
    if (format === '12') {
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return value;
  }, [value, format]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (disabled) {
    return (
      <div className={`time-picker-wrapper ${className}`}>
        <div className="flex items-center h-9 bg-muted rounded px-3 text-sm text-muted-foreground">
          {displayValue || 'No time selected'}
        </div>
      </div>
    );
  }

  return (
    <div className={`time-picker-wrapper relative ${className}`} ref={wrapperRef}>
      <input
        type="text"
        readOnly
        value={displayValue}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Select time"
        className="w-full h-9 bg-background rounded px-3 text-sm text-foreground border border-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 p-3">
          <div style={{ minHeight: '180px', width: '100%', position: 'relative' }}>
            {(Picker as any)({
              optionGroups,
              valueGroups: pickerValue,
              onChange: (value: any, key: string) => handleChange(value),
              itemHeight: 36,
              height: 180,
            })}
            {/* Debug: Show current values */}
            <div className="text-xs text-muted-foreground mt-2 text-center">
              {JSON.stringify(pickerValue)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePickerComponent;

