import React from 'react';
interface LegendSeriesIconProps {
    disabled: boolean;
    color: string;
    yAxis: number;
    onColorChange: (color: string) => void;
    onToggleAxis?: () => void;
}
export declare const LegendSeriesIcon: React.FunctionComponent<LegendSeriesIconProps>;
export {};
