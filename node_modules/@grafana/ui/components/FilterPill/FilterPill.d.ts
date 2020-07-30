import React from 'react';
import { IconName } from '../../types';
interface FilterPillProps {
    selected: boolean;
    label: string;
    onClick: React.MouseEventHandler<HTMLElement>;
    icon?: IconName;
}
export declare const FilterPill: React.FC<FilterPillProps>;
export {};
