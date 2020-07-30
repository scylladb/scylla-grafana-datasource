import React from 'react';
import { SegmentProps } from '.';
export interface SegmentInputProps<T> extends SegmentProps<T> {
    value: string | number;
    onChange: (text: string | number) => void;
    autofocus?: boolean;
}
export declare function SegmentInput<T>({ value: initialValue, onChange, Component, className, placeholder, autofocus, }: React.PropsWithChildren<SegmentInputProps<T>>): JSX.Element;
