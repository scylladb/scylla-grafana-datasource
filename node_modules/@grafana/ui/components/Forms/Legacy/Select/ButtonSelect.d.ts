import { PureComponent, ReactElement } from 'react';
import { PopoverContent } from '../../../Tooltip/Tooltip';
import { SelectableValue } from '@grafana/data';
export interface Props<T> {
    className: string | undefined;
    options: Array<SelectableValue<T>>;
    value?: SelectableValue<T>;
    label?: ReactElement | string;
    iconClass?: string;
    components?: any;
    maxMenuHeight?: number;
    onChange: (item: SelectableValue<T>) => void;
    tooltipContent?: PopoverContent;
    isMenuOpen?: boolean;
    onOpenMenu?: () => void;
    onCloseMenu?: () => void;
    tabSelectsValue?: boolean;
    autoFocus?: boolean;
}
export declare class ButtonSelect<T> extends PureComponent<Props<T>> {
    onChange: (item: SelectableValue<T>) => void;
    render(): JSX.Element;
}
