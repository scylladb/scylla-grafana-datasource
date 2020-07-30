import React from 'react';
import { SelectableValue } from '@grafana/data';
import { SegmentProps } from '.';
export interface SegmentAsyncProps<T> extends SegmentProps<T> {
    value?: T | SelectableValue<T>;
    loadOptions: (query?: string) => Promise<Array<SelectableValue<T>>>;
    onChange: (item: SelectableValue<T>) => void;
}
export declare function SegmentAsync<T>({ value, onChange, loadOptions, Component, className, allowCustomValue, placeholder, }: React.PropsWithChildren<SegmentAsyncProps<T>>): JSX.Element;
