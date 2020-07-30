/// <reference types="react" />
import { IconName } from '../../types';
import { SelectableValue } from '@grafana/data';
import { ButtonVariant } from '../Button';
import { ComponentSize } from '../../types/size';
interface ValuePickerProps<T> {
    /** Label to display on the picker button */
    label: string;
    /** Icon to display on the picker button */
    icon?: IconName;
    /** ValuePicker options  */
    options: Array<SelectableValue<T>>;
    onChange: (value: SelectableValue<T>) => void;
    variant?: ButtonVariant;
    size?: ComponentSize;
    isFullWidth?: boolean;
    menuPlacement?: 'auto' | 'bottom' | 'top';
}
export declare function ValuePicker<T>({ label, icon, options, onChange, variant, size, isFullWidth, menuPlacement, }: ValuePickerProps<T>): JSX.Element;
export {};
