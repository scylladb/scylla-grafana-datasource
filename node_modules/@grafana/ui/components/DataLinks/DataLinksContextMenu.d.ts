import React from 'react';
import { LinkModel } from '@grafana/data';
interface DataLinksContextMenuProps {
    children: (props: DataLinksContextMenuApi) => JSX.Element;
    links: () => LinkModel[];
}
export interface DataLinksContextMenuApi {
    openMenu?: React.MouseEventHandler<HTMLElement>;
    targetClassName?: string;
}
export declare const DataLinksContextMenu: React.FC<DataLinksContextMenuProps>;
export {};
