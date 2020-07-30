import React from 'react';
import { LegendProps, LegendItem, LegendDisplayMode } from '../Legend/Legend';
import { SeriesColorChangeHandler, SeriesAxisToggleHandler } from './GraphWithLegend';
export interface GraphLegendProps extends LegendProps {
    displayMode: LegendDisplayMode;
    sortBy?: string;
    sortDesc?: boolean;
    onSeriesColorChange?: SeriesColorChangeHandler;
    onSeriesAxisToggle?: SeriesAxisToggleHandler;
    onToggleSort?: (sortBy: string) => void;
    onLabelClick?: (item: LegendItem, event: React.MouseEvent<HTMLElement>) => void;
}
export declare const GraphLegend: React.FunctionComponent<GraphLegendProps>;
