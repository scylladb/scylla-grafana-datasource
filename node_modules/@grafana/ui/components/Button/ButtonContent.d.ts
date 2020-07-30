import React from 'react';
import { IconName } from '../../types/icon';
import { ComponentSize } from '../../types/size';
declare type Props = {
    icon?: IconName;
    className?: string;
    children: React.ReactNode;
    size?: ComponentSize;
};
export declare function ButtonContent(props: Props): JSX.Element;
export {};
