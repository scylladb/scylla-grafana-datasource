import { DeepPartial, FieldName } from '../types';
declare const _default: <FormValues extends Record<string, any>>(defaultValues: DeepPartial<FormValues>, name: FieldName<FormValues>, defaultValue?: Record<string, any> | undefined) => DeepPartial<FormValues> | FormValues[FieldName<FormValues>] | undefined;
export default _default;
