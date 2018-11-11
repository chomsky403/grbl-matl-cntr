/// <reference types="react" />
import * as React from "react";
import { AbstractPureComponent } from "../../common/abstractPureComponent";
import { IProps } from "../../common/props";
export interface ICollapseProps extends IProps {
    /**
     * Component to render as the root element.
     * Useful when rendering a `Collapse` inside a `<table>`, for instance.
     * @default "div"
     */
    component?: React.ReactType;
    /**
     * Whether the component is open or closed.
     * @default false
     */
    isOpen?: boolean;
    /**
     * Whether the child components will remain mounted when the `Collapse` is closed.
     * Setting to true may improve performance by avoiding re-mounting children.
     * @default false
     */
    keepChildrenMounted?: boolean;
    /**
     * The length of time the transition takes, in milliseconds. This must match
     * the duration of the animation in CSS. Only set this prop if you override
     * Blueprint's default transitions with new transitions of a different
     * length.
     * @default 200
     */
    transitionDuration?: number;
}
export interface ICollapseState {
    /** The height that should be used for the content animations. This is a CSS value, not just a number. */
    height: string;
    /** The state the element is currently in. */
    animationState: AnimationStates;
}
/**
 * `Collapse` can be in one of six states, enumerated here.
 * When changing the `isOpen` prop, the following happens to the states:
 * isOpen={true}  : CLOSED -> OPEN_START -> OPENING -> OPEN
 * isOpen={false} : OPEN -> CLOSING_START -> CLOSING -> CLOSED
 */
export declare enum AnimationStates {
    /**
     * The body is re-rendered, height is set to the measured body height and
     * the body Y is set to 0.
     */
    OPEN_START = 0,
    /**
     * Animation begins, height is set to auto. This is all animated, and on
     * complete, the state changes to OPEN.
     */
    OPENING = 1,
    /**
     * The collapse height is set to auto, and the body Y is set to 0 (so the
     * element can be seen as normal).
     */
    OPEN = 2,
    /**
     * Height has been changed from auto to the measured height of the body to
     * prepare for the closing animation in CLOSING.
     */
    CLOSING_START = 3,
    /**
     * Height is set to 0 and the body Y is at -height. Both of these properties
     * are transformed, and then after the animation is complete, the state
     * changes to CLOSED.
     */
    CLOSING = 4,
    /**
     * The contents of the collapse is not rendered, the collapse height is 0,
     * and the body Y is at -height (so that the bottom of the body is at Y=0).
     */
    CLOSED = 5,
}
export declare class Collapse extends AbstractPureComponent<ICollapseProps, ICollapseState> {
    static displayName: string;
    static defaultProps: ICollapseProps;
    state: {
        animationState: AnimationStates;
        height: string;
    };
    private contents;
    private height;
    componentWillReceiveProps(nextProps: ICollapseProps): void;
    render(): React.ReactElement<any>;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private contentsRefHandler;
    private onDelayedStateChange();
}
