import { GrafanaTheme } from '@grafana/data';
import { ButtonVariant } from '../Button';
import { ComponentSize } from '../../types/size';
export declare const getFormStyles: (theme: GrafanaTheme, options: {
    variant: ButtonVariant;
    size: ComponentSize;
    invalid: boolean;
}) => {
    label: {
        label: string;
        labelContent: string;
        description: string;
        categories: string;
        chevron: string;
    };
    legend: {
        legend: string;
    };
    fieldValidationMessage: {
        fieldValidationMessage: string;
        fieldValidationMessageIcon: string;
    };
    button: {
        button: string;
        iconButton: string;
        iconWrap: string;
    };
    input: {
        wrapper: string;
        inputWrapper: string;
        input: string;
        inputDisabled: string;
        addon: string;
        prefix: string;
        suffix: string;
        loadingIndicator: string;
    };
    switch: {
        switch: string;
    };
    checkbox: {
        label: string;
        description: string;
        wrapper: string;
        input: string;
        checkmark: string;
    };
};
