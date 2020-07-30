import React from 'react';
import { Themeable } from '../../types/theme';
export interface CallToActionCardProps extends Themeable {
    message?: string | JSX.Element;
    callToActionElement: JSX.Element;
    footer?: string | JSX.Element;
    className?: string;
}
export declare const CallToActionCard: React.FunctionComponent<CallToActionCardProps>;
