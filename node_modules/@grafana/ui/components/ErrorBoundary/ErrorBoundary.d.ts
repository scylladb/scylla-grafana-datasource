import React, { PureComponent, ReactNode } from 'react';
export interface ErrorInfo {
    componentStack: string;
}
export interface ErrorBoundaryApi {
    error: Error | null;
    errorInfo: ErrorInfo | null;
}
interface Props {
    children: (r: ErrorBoundaryApi) => ReactNode;
}
interface State {
    error: Error | null;
    errorInfo: ErrorInfo | null;
}
export declare class ErrorBoundary extends PureComponent<Props, State> {
    readonly state: State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): React.ReactNode;
}
interface WithAlertBoxProps {
    title?: string;
    children: ReactNode;
    style?: 'page' | 'alertbox';
}
export declare class ErrorBoundaryAlert extends PureComponent<WithAlertBoxProps> {
    static defaultProps: Partial<WithAlertBoxProps>;
    render(): JSX.Element;
}
export {};
