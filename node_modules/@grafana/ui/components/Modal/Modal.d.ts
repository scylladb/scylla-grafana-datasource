import React from 'react';
import { IconName } from '../../types';
import { Themeable } from '../../types';
export interface Props extends Themeable {
    icon?: IconName;
    /** Title for the modal or custom header element */
    title: string | JSX.Element;
    className?: string;
    isOpen?: boolean;
    onDismiss?: () => void;
    /** If not set will call onDismiss if that is set. */
    onClickBackdrop?: () => void;
}
export declare class UnthemedModal extends React.PureComponent<Props> {
    onDismiss: () => void;
    onClickBackdrop: () => void;
    renderDefaultHeader(title: string): JSX.Element;
    render(): JSX.Element | null;
}
export declare const Modal: React.FunctionComponent<Pick<Props, "title" | "className" | "icon" | "isOpen" | "onDismiss" | "onClickBackdrop">>;
