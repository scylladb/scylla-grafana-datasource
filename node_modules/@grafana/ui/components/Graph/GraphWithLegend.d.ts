import React from 'react';
import { GraphProps } from './Graph';
import { LegendRenderOptions, LegendDisplayMode } from '../Legend/Legend';
export declare type SeriesOptionChangeHandler<TOption> = (label: string, option: TOption) => void;
export declare type SeriesColorChangeHandler = SeriesOptionChangeHandler<string>;
export declare type SeriesAxisToggleHandler = SeriesOptionChangeHandler<number>;
export interface GraphWithLegendProps extends GraphProps, LegendRenderOptions {
    isLegendVisible: boolean;
    displayMode: LegendDisplayMode;
    sortLegendBy?: string;
    sortLegendDesc?: boolean;
    onSeriesColorChange?: SeriesColorChangeHandler;
    onSeriesAxisToggle?: SeriesAxisToggleHandler;
    onSeriesToggle?: (label: string, event: React.MouseEvent<HTMLElement>) => void;
    onToggleSort: (sortBy: string) => void;
}
export declare const GraphWithLegend: React.FunctionComponent<GraphWithLegendProps>;
