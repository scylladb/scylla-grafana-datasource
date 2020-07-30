/// <reference types="react" />
import { ButtonVariant } from '../Button';
import { ComponentSize } from '../../types/size';
import { SelectCommonProps } from './types';
import { IconName } from '../../types';
interface ButtonSelectProps<T> extends Omit<SelectCommonProps<T>, 'renderControl' | 'size' | 'prefix'> {
    icon?: IconName;
    variant?: ButtonVariant;
    size?: ComponentSize;
}
export declare function ButtonSelect<T>({ placeholder, icon, variant, size, className, disabled, ...selectProps }: ButtonSelectProps<T>): JSX.Element;
export {};
