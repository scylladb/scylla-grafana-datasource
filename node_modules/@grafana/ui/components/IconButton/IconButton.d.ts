import React from 'react';
import { IconName, IconSize, IconType } from '../../types/icon';
import { TooltipPlacement } from '../Tooltip/PopoverController';
export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    name: IconName;
    size?: IconSize;
    /** Need this to change hover effect based on what surface it is on */
    surface?: SurfaceType;
    iconType?: IconType;
    tooltip?: string;
    tooltipPlacement?: TooltipPlacement;
}
declare type SurfaceType = 'dashboard' | 'panel' | 'header';
export declare const IconButton: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLButtonElement>>;
export {};
