import React, { PureComponent } from 'react';
interface Props {
    className?: string;
    root?: HTMLElement;
    forwardedRef?: any;
}
export declare class Portal extends PureComponent<Props> {
    node: HTMLElement;
    portalRoot: HTMLElement;
    constructor(props: Props);
    componentWillUnmount(): void;
    render(): React.ReactPortal;
}
export declare const RefForwardingPortal: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
