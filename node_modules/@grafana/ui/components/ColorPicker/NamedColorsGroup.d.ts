import React, { FunctionComponent } from 'react';
import { Themeable } from '../../types';
import { ColorDefinition } from '@grafana/data';
import { Color } from 'csstype';
declare type ColorChangeHandler = (color: ColorDefinition) => void;
export declare enum ColorSwatchVariant {
    Small = "small",
    Large = "large"
}
interface ColorSwatchProps extends Themeable, React.DOMAttributes<HTMLDivElement> {
    color: string;
    label?: string;
    variant?: ColorSwatchVariant;
    isSelected?: boolean;
}
export declare const ColorSwatch: FunctionComponent<ColorSwatchProps>;
interface NamedColorsGroupProps extends Themeable {
    colors: ColorDefinition[];
    selectedColor?: Color;
    onColorSelect: ColorChangeHandler;
    key?: string;
}
declare const NamedColorsGroup: FunctionComponent<NamedColorsGroupProps>;
export default NamedColorsGroup;
