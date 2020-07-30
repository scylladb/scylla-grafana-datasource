import React from 'react';
import { Themeable } from '../../types';
export interface SpectrumPaletteProps extends Themeable {
    color: string;
    onChange: (color: string) => void;
}
declare const SpectrumPalette: React.FunctionComponent<SpectrumPaletteProps>;
export default SpectrumPalette;
