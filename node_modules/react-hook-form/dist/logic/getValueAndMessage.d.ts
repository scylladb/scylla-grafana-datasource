import { ValidationValue } from '../types';
declare type ValidationValueMessage = {
    value: ValidationValue;
    message: string;
};
declare const _default: (validationData?: string | number | boolean | RegExp | ValidationValueMessage | undefined) => {
    value: ValidationValue;
    message: string;
};
export default _default;
