import { PureComponent } from 'react';
import { DisplayValue, GrafanaThemeType } from '@grafana/data';
import { Themeable } from '../../index';
export declare enum PieChartType {
    PIE = "pie",
    DONUT = "donut"
}
export interface Props extends Themeable {
    height: number;
    width: number;
    values: DisplayValue[];
    pieType: PieChartType;
    strokeWidth: number;
}
export declare class PieChart extends PureComponent<Props> {
    containerElement: any;
    svgElement: any;
    tooltipElement: any;
    tooltipValueElement: any;
    static defaultProps: {
        pieType: string;
        format: string;
        stat: string;
        strokeWidth: number;
        theme: GrafanaThemeType;
    };
    componentDidMount(): void;
    componentDidUpdate(): void;
    draw(): void;
    render(): JSX.Element;
}
