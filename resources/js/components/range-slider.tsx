import { useCallback, useMemo } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    minValue: number;
    maxValue: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
    accentColor?: string;
}

/**
 * Dual-handle range slider. Both thumbs can be dragged on a single track,
 * with the selected range highlighted between them.
 */
export function RangeSlider({
    min,
    max,
    step = 1,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    accentColor = '#F26B5E',
}: RangeSliderProps) {
    const minPct = useMemo(() => {
        if (max === min) return 0;
        return ((minValue - min) / (max - min)) * 100;
    }, [min, max, minValue]);

    const maxPct = useMemo(() => {
        if (max === min) return 100;
        return ((maxValue - min) / (max - min)) * 100;
    }, [min, max, maxValue]);

    const handleMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(Number(e.target.value), maxValue - step);
            onMinChange(value);
        },
        [maxValue, step, onMinChange]
    );

    const handleMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(Number(e.target.value), minValue + step);
            onMaxChange(value);
        },
        [minValue, step, onMaxChange]
    );

    return (
        <div className="relative h-10 w-full select-none">
            {/* Track */}
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200" />

            {/* Selected range */}
            <div
                className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                style={{
                    left: `${minPct}%`,
                    right: `${100 - maxPct}%`,
                    backgroundColor: accentColor,
                }}
            />

            {/* Min thumb input */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={minValue}
                onChange={handleMinChange}
                className="range-thumb absolute inset-0 h-full w-full appearance-none bg-transparent"
                style={{ pointerEvents: 'none' }}
                aria-label="Minimum value"
            />

            {/* Max thumb input */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxValue}
                onChange={handleMaxChange}
                className="range-thumb absolute inset-0 h-full w-full appearance-none bg-transparent"
                style={{ pointerEvents: 'none' }}
                aria-label="Maximum value"
            />

            <style>{`
                .range-thumb::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 9999px;
                    background: #ffffff;
                    border: 3px solid ${accentColor};
                    cursor: grab;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    position: relative;
                    z-index: 2;
                }
                .range-thumb::-webkit-slider-thumb:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }
                .range-thumb::-moz-range-thumb {
                    pointer-events: auto;
                    width: 20px;
                    height: 20px;
                    border-radius: 9999px;
                    background: #ffffff;
                    border: 3px solid ${accentColor};
                    cursor: grab;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .range-thumb::-moz-range-thumb:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }
                .range-thumb::-webkit-slider-runnable-track {
                    background: transparent;
                    border: none;
                }
                .range-thumb::-moz-range-track {
                    background: transparent;
                    border: none;
                }
                .range-thumb:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
}
