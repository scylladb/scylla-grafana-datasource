import { FunctionComponent } from 'react';
interface Props {
    title?: string | JSX.Element;
    onClose?: () => void;
    children: JSX.Element | JSX.Element[] | boolean;
    onAdd?: () => void;
}
export declare const PanelOptionsGroup: FunctionComponent<Props>;
export {};
