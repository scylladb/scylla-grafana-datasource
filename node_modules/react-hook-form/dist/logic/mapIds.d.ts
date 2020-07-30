export declare const appendId: <FormArrayValues extends Record<string, any> = Record<string, any>>(value: FormArrayValues, keyName: string) => (FormArrayValues & {
    [x: string]: string;
}) | {
    value: never;
};
export declare const mapIds: (data: any, keyName: string) => any[];
