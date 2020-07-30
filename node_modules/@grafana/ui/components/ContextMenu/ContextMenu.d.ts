import React from 'react';
import { LinkTarget } from '@grafana/data';
export interface ContextMenuItem {
    label: string;
    target?: LinkTarget;
    icon?: string;
    url?: string;
    onClick?: (event?: React.SyntheticEvent<HTMLElement>) => void;
    group?: string;
}
export interface ContextMenuGroup {
    label?: string;
    items: ContextMenuItem[];
}
export interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    items?: ContextMenuGroup[];
    renderHeader?: () => React.ReactNode;
}
export declare const ContextMenu: React.FC<ContextMenuProps>;
