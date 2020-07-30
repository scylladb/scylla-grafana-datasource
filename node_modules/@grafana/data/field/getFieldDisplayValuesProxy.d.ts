import { DataFrame, DisplayValue, GrafanaTheme, TimeZone } from '../types';
/**
 *
 * @param frame
 * @param rowIndex
 * @param options
 * @internal
 */
export declare function getFieldDisplayValuesProxy(frame: DataFrame, rowIndex: number, options: {
    theme: GrafanaTheme;
    timeZone?: TimeZone;
}): Record<string, DisplayValue>;
