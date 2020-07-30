import React from 'react';
import { TimeOption } from '@grafana/data';
interface Props {
    value: TimeOption;
    selected?: boolean;
    onSelect: (option: TimeOption) => void;
}
export declare const TimeRangeOption: React.NamedExoticComponent<Props>;
export {};
