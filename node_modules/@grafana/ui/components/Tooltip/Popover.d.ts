import React, { PureComponent } from 'react';
import * as PopperJS from 'popper.js';
import { PopperArrowProps } from 'react-popper';
import { PopoverContent } from './Tooltip';
export declare type RenderPopperArrowFn = (props: {
    arrowProps: PopperArrowProps;
    placement: string;
}) => JSX.Element;
interface Props extends React.HTMLAttributes<HTMLDivElement> {
    show: boolean;
    placement?: PopperJS.Placement;
    content: PopoverContent;
    referenceElement: PopperJS.ReferenceObject;
    wrapperClassName?: string;
    renderArrow?: RenderPopperArrowFn;
    eventsEnabled?: boolean;
}
declare class Popover extends PureComponent<Props> {
    static defaultProps: Partial<Props>;
    render(): JSX.Element;
}
export { Popover };
