'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface WheelTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  format?: '12' | '24';
  onFormatChange?: (format: '12' | '24') => void;
  disabled?: boolean;
  className?: string;
}

export function WheelTimePicker({ 
  value, 
  onChange, 
  format = '24',
  onFormatChange,
  disabled = false, 
  className = '' 
}: WheelTimePickerProps) {
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
    }
    return { hour: hours || 12, minute: minutes || 0, period: 'AM' };
  };

  const currentTime = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(currentTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(currentTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(currentTime.period as 'AM' | 'PM');

  useEffect(() => {
    const parsed = parseTime(value);
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedPeriod(parsed.period as 'AM' | 'PM');
  }, [value, format]);

  const hourOptions = format === '12' 
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);

  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour);
    updateTime(hour, selectedMinute, selectedPeriod);
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    updateTime(selectedHour, minute, selectedPeriod);
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setSelectedPeriod(period);
    updateTime(selectedHour, selectedMinute, period);
  };

  const updateTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    let hour24 = hour;
    if (format === '12') {
      if (period === 'PM' && hour !== 12) hour24 = hour + 12;
      else if (period === 'AM' && hour === 12) hour24 = 0;
    }
    onChange(`${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  };

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

  const WheelColumn = ({ 
    options, 
    selected, 
    onChange, 
    label 
  }: { 
    options: number[]; 
    selected: number; 
    onChange: (value: number) => void;
    label?: string;
  }) => {
    const columnRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const itemHeight = 28;
    const containerHeight = 140;
    const centerOffset = (containerHeight - itemHeight) / 2;

    // Scroll to selected item on mount and when selected changes
    useEffect(() => {
      if (columnRef.current) {
        const selectedIndex = options.indexOf(selected);
        if (selectedIndex >= 0) {
          const scrollPosition = selectedIndex * itemHeight;
          
          // Use setTimeout to ensure DOM is fully rendered
          setTimeout(() => {
            if (columnRef.current) {
              columnRef.current.scrollTop = scrollPosition;
            }
          }, 0);
        }
      }
    }, [selected, options]);

    const handleScroll = () => {
      if (columnRef.current) {
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollTop = columnRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
        
        if (options[clampedIndex] !== selected) {
          onChange(options[clampedIndex]);
        }

        // Snap to nearest item when scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          if (columnRef.current) {
            const finalScrollTop = columnRef.current.scrollTop;
            const finalIndex = Math.round(finalScrollTop / itemHeight);
            const finalClampedIndex = Math.max(0, Math.min(finalIndex, options.length - 1));
            const snapPosition = finalClampedIndex * itemHeight;
            
            columnRef.current.scrollTo({
              top: snapPosition,
              behavior: 'smooth'
            });
          }
        }, 150);
      }
    };

    return (
      <div className="flex-1 flex flex-col items-center">
        {label && <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>}
        <div className="relative h-[140px] w-full">
          {/* Selection highlight bar */}
          <div className="absolute top-1/2 left-0 right-0 h-[28px] -translate-y-1/2 border-t border-b border-border bg-muted/30 pointer-events-none z-10 rounded" />
          
          {/* Scrollable column */}
          <div
            ref={columnRef}
            className="relative h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
            onScroll={handleScroll}
            style={{
              scrollSnapType: 'y mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Top padding to center first item */}
            <div style={{ height: centerOffset }} />
            
            {/* Options list */}
            <div className="flex flex-col">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    const index = options.indexOf(option);
                    const scrollPosition = index * itemHeight;
                    columnRef.current?.scrollTo({
                      top: scrollPosition,
                      behavior: 'smooth'
                    });
                    onChange(option);
                  }}
                  className={`h-[28px] flex items-center justify-center cursor-pointer transition-all ${
                    option === selected
                      ? 'text-foreground font-semibold text-base'
                      : 'text-muted-foreground opacity-60 text-sm'
                  }`}
                  style={{ scrollSnapAlign: 'center' }}
                >
                  {option.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
            
            {/* Bottom padding to center last item */}
            <div style={{ height: centerOffset }} />
          </div>
        </div>
      </div>
    );
  };

  if (disabled) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center h-9 bg-muted rounded px-3 text-sm text-muted-foreground">
          {displayValue || 'No time selected'}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {/* Input Field - Always Visible */}
      <input
        type="text"
        readOnly
        value={displayValue}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Select time"
        className="w-full h-9 bg-background rounded px-3 text-sm text-foreground border border-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      
      {/* Wheel Picker - Absolute Positioned Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-2 max-w-xs mx-auto w-full z-[100]">
          {/* 12hr/24hr Toggle */}
          {onFormatChange && (
            <div className="flex items-center justify-center gap-2 mb-2 pb-2 border-b border-border">
              <span className="text-xs text-muted-foreground">12hr</span>
              <button
                onClick={() => onFormatChange(format === '12' ? '24' : '12')}
                className={`relative w-10 h-5 rounded-full border transition-colors ${
                  format === '12'
                    ? 'bg-primary border-primary'
                    : 'bg-muted border-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    format === '12' ? 'translate-x-0' : 'translate-x-5'
                  }`}
                />
              </button>
              <span className="text-xs text-muted-foreground">24hr</span>
            </div>
          )}
          
          <div className="flex gap-1.5" style={{ height: '140px' }}>
            <WheelColumn
              options={hourOptions}
              selected={selectedHour}
              onChange={handleHourChange}
              label="Hour"
            />
            <WheelColumn
              options={minuteOptions}
              selected={selectedMinute}
              onChange={handleMinuteChange}
              label="Min"
            />
            {format === '12' && (
              <div className="flex-1 flex flex-col items-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">Period</div>
                <div className="relative h-[140px] w-full">
                  {/* Selection highlight bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-[28px] -translate-y-1/2 border-t border-b border-border bg-muted/30 pointer-events-none z-10 rounded" />
                  
                  {/* Scrollable column */}
                  <div className="relative h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Top padding */}
                    <div style={{ height: (140 - 28) / 2 }} />
                    
                    {/* Options */}
                    <div className="flex flex-col">
                      {(['AM', 'PM'] as const).map((period) => (
                        <div
                          key={period}
                          onClick={() => handlePeriodChange(period)}
                          className={`h-[28px] flex items-center justify-center cursor-pointer transition-all ${
                            period === selectedPeriod
                              ? 'text-foreground font-semibold text-base'
                              : 'text-muted-foreground opacity-60 text-sm'
                          }`}
                        >
                          {period}
                        </div>
                      ))}
                    </div>
                    
                    {/* Bottom padding */}
                    <div style={{ height: (140 - 28) / 2 }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

