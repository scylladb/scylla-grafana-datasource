import React from 'react';
import { LogLabelStatsModel } from '@grafana/data';
import { Themeable } from '../../types/theme';
interface Props extends Themeable {
    stats: LogLabelStatsModel[];
    label: string;
    value: string;
    rowCount: number;
    isLabel?: boolean;
}
export declare const LogLabelStats: React.FunctionComponent<Pick<Props, "value" | "stats" | "label" | "rowCount" | "isLabel">>;
export {};
