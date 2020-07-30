import { FC, ReactNode, PureComponent } from 'react';
interface ToggleButtonGroupProps {
    label?: string;
    children: JSX.Element[];
    transparent?: boolean;
    width?: number;
}
export declare class ToggleButtonGroup extends PureComponent<ToggleButtonGroupProps> {
    render(): JSX.Element;
}
interface ToggleButtonProps {
    onChange?: (value: any) => void;
    selected?: boolean;
    value: any;
    className?: string;
    children: ReactNode;
    tooltip?: string;
}
export declare const ToggleButton: FC<ToggleButtonProps>;
export {};
