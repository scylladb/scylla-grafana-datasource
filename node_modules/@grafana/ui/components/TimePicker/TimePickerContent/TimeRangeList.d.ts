import React, { ReactNode } from 'react';
import { TimeOption, TimeZone } from '@grafana/data';
import { TimeRange } from '@grafana/data';
interface Props {
    title?: string;
    options: TimeOption[];
    value?: TimeRange;
    onSelect: (option: TimeRange) => void;
    placeholderEmpty?: ReactNode;
    timeZone?: TimeZone;
}
export declare const TimeRangeList: React.FC<Props>;
export {};
