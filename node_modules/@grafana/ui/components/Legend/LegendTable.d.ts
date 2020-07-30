import React from 'react';
import { LegendComponentProps } from './Legend';
export interface LegendTableProps extends LegendComponentProps {
    columns: string[];
    sortBy?: string;
    sortDesc?: boolean;
    onToggleSort?: (sortBy: string) => void;
}
export declare const LegendTable: React.FunctionComponent<LegendTableProps>;
