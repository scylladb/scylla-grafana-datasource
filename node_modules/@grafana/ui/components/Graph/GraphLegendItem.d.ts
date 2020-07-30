import React from 'react';
import { LegendItem } from '../Legend/Legend';
import { SeriesColorChangeHandler } from './GraphWithLegend';
export interface GraphLegendItemProps {
    key?: React.Key;
    item: LegendItem;
    className?: string;
    onLabelClick?: (item: LegendItem, event: React.MouseEvent<HTMLDivElement>) => void;
    onSeriesColorChange?: SeriesColorChangeHandler;
    onToggleAxis?: () => void;
}
export declare const GraphLegendListItem: React.FunctionComponent<GraphLegendItemProps>;
export declare const GraphLegendTableRow: React.FunctionComponent<GraphLegendItemProps>;
