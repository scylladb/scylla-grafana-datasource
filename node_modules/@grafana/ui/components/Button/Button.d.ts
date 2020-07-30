import React, { ButtonHTMLAttributes } from 'react';
import { IconName } from '../../types/icon';
import { GrafanaTheme } from '@grafana/data';
import { ComponentSize } from '../../types/size';
export interface StyleProps {
    theme: GrafanaTheme;
    size: ComponentSize;
    variant: ButtonVariant;
    hasIcon: boolean;
    hasText: boolean;
}
export declare const getButtonStyles: (props: StyleProps) => {
    button: string;
    iconButton: string;
    iconWrap: string;
};
export declare type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'link';
declare type CommonProps = {
    size?: ComponentSize;
    variant?: ButtonVariant;
    icon?: IconName;
    className?: string;
};
export declare type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
export declare const Button: React.ForwardRefExoticComponent<CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export declare const LinkButton: React.ForwardRefExoticComponent<CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.RefAttributes<HTMLAnchorElement>>;
export {};
