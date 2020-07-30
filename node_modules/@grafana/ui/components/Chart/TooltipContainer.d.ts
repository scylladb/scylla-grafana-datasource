import React from 'react';
interface TooltipContainerProps {
    position: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    children?: JSX.Element;
}
export declare const TooltipContainer: React.FC<TooltipContainerProps>;
export {};
