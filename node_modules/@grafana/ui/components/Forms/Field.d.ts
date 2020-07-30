import React from 'react';
import { GrafanaTheme } from '@grafana/data';
export interface FieldProps {
    /** Form input element, i.e Input or Switch */
    children: React.ReactElement;
    /** Label for the field */
    label?: React.ReactNode;
    /** Description of the field */
    description?: string;
    /** Indicates if field is in invalid state */
    invalid?: boolean;
    /** Indicates if field is in loading state */
    loading?: boolean;
    /** Indicates if field is disabled */
    disabled?: boolean;
    /** Indicates if field is required */
    required?: boolean;
    /** Error message to display */
    error?: string;
    /** Indicates horizontal layout of the field */
    horizontal?: boolean;
    className?: string;
}
export declare const getFieldStyles: (theme: GrafanaTheme) => {
    field: string;
    fieldHorizontal: string;
    fieldValidationWrapper: string;
    fieldValidationWrapperHorizontal: string;
};
export declare const Field: React.FC<FieldProps>;
