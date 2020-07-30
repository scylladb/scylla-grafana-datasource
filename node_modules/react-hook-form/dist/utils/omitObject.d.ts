declare type OmitObject = {
    <T, K extends keyof T>(obj: T, key: K): any;
};
declare const omitObject: OmitObject;
export default omitObject;
