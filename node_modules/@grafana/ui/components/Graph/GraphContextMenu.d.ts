import React from 'react';
import { ContextMenuProps } from '../ContextMenu/ContextMenu';
import { GraphDimensions } from './GraphTooltip/types';
import { FlotDataPoint, Dimensions, TimeZone } from '@grafana/data';
export declare type ContextDimensions<T extends Dimensions = any> = {
    [key in keyof T]: [number, number | undefined] | null;
};
export declare type GraphContextMenuProps = ContextMenuProps & {
    getContextMenuSource: () => FlotDataPoint | null;
    timeZone?: TimeZone;
    dimensions?: GraphDimensions;
    contextDimensions?: ContextDimensions;
};
export declare const GraphContextMenu: React.FC<GraphContextMenuProps>;
