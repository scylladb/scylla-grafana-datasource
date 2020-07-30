export declare type StringSelector = string;
export declare type FunctionSelector = (id: string) => string;
export declare type CssSelector = () => string;
export interface Selectors {
    [key: string]: StringSelector | FunctionSelector | CssSelector | UrlSelector | Selectors;
}
export declare type E2ESelectors<S extends Selectors> = {
    [P in keyof S]: S[P];
};
export interface UrlSelector extends Selectors {
    url: string | FunctionSelector;
}
