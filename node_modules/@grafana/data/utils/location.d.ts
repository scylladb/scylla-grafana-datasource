import { GrafanaConfig, RawTimeRange, ScopedVars } from '../types';
interface LocationUtilDependencies {
    getConfig: () => GrafanaConfig;
    getTimeRangeForUrl: () => RawTimeRange;
    buildParamsFromVariables: (params: any, scopedVars?: ScopedVars) => string;
}
export declare const locationUtil: {
    /**
     *
     * @param getConfig
     * @param buildParamsFromVariables
     * @param getTimeRangeForUrl
     * @internal
     */
    initialize: ({ getConfig, buildParamsFromVariables, getTimeRangeForUrl }: LocationUtilDependencies) => void;
    stripBaseFromUrl: (url: string) => string;
    assureBaseUrl: (url: string) => string;
    getTimeRangeUrlParams: () => string | null;
    getVariablesUrlParams: (scopedVars?: ScopedVars | undefined) => string | null;
    processUrl: (url: string) => string;
};
export {};
