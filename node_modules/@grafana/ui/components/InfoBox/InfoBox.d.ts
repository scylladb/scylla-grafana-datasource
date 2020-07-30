import React from 'react';
export interface InfoBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    children: React.ReactNode;
    title?: string | JSX.Element;
    url?: string;
    urlTitle?: string;
    branded?: boolean;
    onDismiss?: () => void;
}
/**
 * This is a simple InfoBox component, the api is not considered stable yet and will likely see breaking changes
 * in future minor releases.
 * @Alpha
 */
export declare const InfoBox: React.MemoExoticComponent<React.ForwardRefExoticComponent<InfoBoxProps & React.RefAttributes<HTMLDivElement>>>;
