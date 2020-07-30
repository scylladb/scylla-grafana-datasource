/// <reference types="react" />
import { SelectableValue } from '@grafana/data';
import { RadioButtonSize } from './RadioButton';
interface RadioButtonGroupProps<T> {
    value?: T;
    disabled?: boolean;
    disabledOptions?: T[];
    options: Array<SelectableValue<T>>;
    onChange?: (value?: T) => void;
    size?: RadioButtonSize;
    fullWidth?: boolean;
}
export declare function RadioButtonGroup<T>({ options, value, onChange, disabled, disabledOptions, size, fullWidth, }: RadioButtonGroupProps<T>): JSX.Element;
export declare namespace RadioButtonGroup {
    var displayName: string;
}
export {};
