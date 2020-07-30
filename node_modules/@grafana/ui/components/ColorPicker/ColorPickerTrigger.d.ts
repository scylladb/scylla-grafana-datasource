import React from 'react';
interface ColorPickerTriggerProps {
    onClick: () => void;
    onMouseLeave: () => void;
    color: string;
}
export declare const ColorPickerTrigger: React.ForwardRefExoticComponent<ColorPickerTriggerProps & React.RefAttributes<HTMLDivElement>>;
export {};
