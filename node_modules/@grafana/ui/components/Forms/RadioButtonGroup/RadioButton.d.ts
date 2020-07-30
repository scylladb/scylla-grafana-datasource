import React from 'react';
export declare type RadioButtonSize = 'sm' | 'md';
export interface RadioButtonProps {
    size?: RadioButtonSize;
    disabled?: boolean;
    name?: string;
    active: boolean;
    id: string;
    onChange: () => void;
    fullWidth?: boolean;
}
export declare const RadioButton: React.FC<RadioButtonProps>;
