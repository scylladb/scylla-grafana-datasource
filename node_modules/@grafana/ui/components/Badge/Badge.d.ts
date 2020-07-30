import React from 'react';
import { IconName } from '../../types';
export declare type BadgeColor = 'blue' | 'red' | 'green' | 'orange' | 'purple';
export interface BadgeProps {
    text: string;
    color: BadgeColor;
    icon?: IconName;
    tooltip?: string;
}
export declare const Badge: React.NamedExoticComponent<BadgeProps>;
