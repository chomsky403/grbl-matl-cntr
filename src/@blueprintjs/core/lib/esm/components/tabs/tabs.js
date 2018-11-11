/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import * as Utils from "../../common/utils";
import { Tab } from "./tab";
import { generateTabPanelId, generateTabTitleId, TabTitle } from "./tabTitle";
export var Expander = function () { return React.createElement("div", { className: Classes.FLEX_EXPANDER }); };
var TAB_SELECTOR = "." + Classes.TAB;
var Tabs = /** @class */ (function (_super) {
    tslib_1.__extends(Tabs, _super);
    function Tabs(props) {
        var _this = _super.call(this, props) || this;
        _this.refHandlers = {
            tablist: function (tabElement) { return (_this.tablistElement = tabElement); },
        };
        _this.handleKeyDown = function (e) {
            var focusedElement = document.activeElement.closest(TAB_SELECTOR);
            // rest of this is potentially expensive and futile, so bail if no tab is focused
            if (focusedElement == null) {
                return;
            }
            // must rely on DOM state because we have no way of mapping `focusedElement` to a JSX.Element
            var enabledTabElements = _this.getTabElements().filter(function (el) { return el.getAttribute("aria-disabled") === "false"; });
            var focusedIndex = enabledTabElements.indexOf(focusedElement);
            var direction = _this.getKeyCodeDirection(e);
            if (focusedIndex >= 0 && direction !== undefined) {
                e.preventDefault();
                var length_1 = enabledTabElements.length;
                // auto-wrapping at 0 and `length`
                var nextFocusedIndex = (focusedIndex + direction + length_1) % length_1;
                enabledTabElements[nextFocusedIndex].focus();
            }
        };
        _this.handleKeyPress = function (e) {
            var targetTabElement = e.target.closest(TAB_SELECTOR);
            if (targetTabElement != null && isEventKeyCode(e, Keys.SPACE, Keys.ENTER)) {
                e.preventDefault();
                targetTabElement.click();
            }
        };
        _this.handleTabClick = function (newTabId, event) {
            Utils.safeInvoke(_this.props.onChange, newTabId, _this.state.selectedTabId, event);
            if (_this.props.selectedTabId === undefined) {
                _this.setState({ selectedTabId: newTabId });
            }
        };
        _this.renderTabPanel = function (tab) {
            var _a = tab.props, className = _a.className, panel = _a.panel, id = _a.id;
            if (panel === undefined) {
                return undefined;
            }
            return (React.createElement("div", { "aria-labelledby": generateTabTitleId(_this.props.id, id), "aria-hidden": id !== _this.state.selectedTabId, className: classNames(Classes.TAB_PANEL, className), id: generateTabPanelId(_this.props.id, id), key: id, role: "tabpanel" }, panel));
        };
        _this.renderTabTitle = function (child) {
            if (isTabElement(child)) {
                var id = child.props.id;
                return (React.createElement(TabTitle, tslib_1.__assign({}, child.props, { parentId: _this.props.id, onClick: _this.handleTabClick, selected: id === _this.state.selectedTabId })));
            }
            return child;
        };
        var selectedTabId = _this.getInitialSelectedTabId();
        _this.state = { selectedTabId: selectedTabId };
        return _this;
    }
    Tabs.prototype.render = function () {
        var _a = this.state, indicatorWrapperStyle = _a.indicatorWrapperStyle, selectedTabId = _a.selectedTabId;
        var tabTitles = React.Children.map(this.props.children, this.renderTabTitle);
        var tabPanels = this.getTabChildren()
            .filter(this.props.renderActiveTabPanelOnly ? function (tab) { return tab.props.id === selectedTabId; } : function () { return true; })
            .map(this.renderTabPanel);
        var tabIndicator = this.props.animate ? (React.createElement("div", { className: Classes.TAB_INDICATOR_WRAPPER, style: indicatorWrapperStyle },
            React.createElement("div", { className: Classes.TAB_INDICATOR }))) : null;
        var classes = classNames(Classes.TABS, (_b = {}, _b[Classes.VERTICAL] = this.props.vertical, _b), this.props.className);
        var tabListClasses = classNames(Classes.TAB_LIST, (_c = {},
            _c[Classes.LARGE] = this.props.large,
            _c));
        return (React.createElement("div", { className: classes },
            React.createElement("div", { className: tabListClasses, onKeyDown: this.handleKeyDown, onKeyPress: this.handleKeyPress, ref: this.refHandlers.tablist, role: "tablist" },
                tabIndicator,
                tabTitles),
            tabPanels));
        var _b, _c;
    };
    Tabs.prototype.componentDidMount = function () {
        this.moveSelectionIndicator();
    };
    Tabs.prototype.componentWillReceiveProps = function (_a) {
        var selectedTabId = _a.selectedTabId;
        if (selectedTabId !== undefined) {
            // keep state in sync with controlled prop, so state is canonical source of truth
            this.setState({ selectedTabId: selectedTabId });
        }
    };
    Tabs.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.state.selectedTabId !== prevState.selectedTabId) {
            this.moveSelectionIndicator();
        }
        else if (prevState.selectedTabId != null) {
            // comparing React nodes is difficult to do with simple logic, so
            // shallowly compare just their props as a workaround.
            var didChildrenChange = !Utils.arraysEqual(this.getTabChildrenProps(prevProps), this.getTabChildrenProps(), Utils.shallowCompareKeys);
            if (didChildrenChange) {
                this.moveSelectionIndicator();
            }
        }
    };
    Tabs.prototype.getInitialSelectedTabId = function () {
        // NOTE: providing an unknown ID will hide the selection
        var _a = this.props, defaultSelectedTabId = _a.defaultSelectedTabId, selectedTabId = _a.selectedTabId;
        if (selectedTabId !== undefined) {
            return selectedTabId;
        }
        else if (defaultSelectedTabId !== undefined) {
            return defaultSelectedTabId;
        }
        else {
            // select first tab in absence of user input
            var tabs = this.getTabChildren();
            return tabs.length === 0 ? undefined : tabs[0].props.id;
        }
    };
    Tabs.prototype.getKeyCodeDirection = function (e) {
        if (isEventKeyCode(e, Keys.ARROW_LEFT, Keys.ARROW_UP)) {
            return -1;
        }
        else if (isEventKeyCode(e, Keys.ARROW_RIGHT, Keys.ARROW_DOWN)) {
            return 1;
        }
        return undefined;
    };
    Tabs.prototype.getTabChildrenProps = function (props) {
        if (props === void 0) { props = this.props; }
        return this.getTabChildren(props).map(function (child) { return child.props; });
    };
    /** Filters children to only `<Tab>`s */
    Tabs.prototype.getTabChildren = function (props) {
        if (props === void 0) { props = this.props; }
        return React.Children.toArray(props.children).filter(isTabElement);
    };
    /** Queries root HTML element for all tabs with optional filter selector */
    Tabs.prototype.getTabElements = function (subselector) {
        if (subselector === void 0) { subselector = ""; }
        if (this.tablistElement == null) {
            return [];
        }
        return Array.from(this.tablistElement.querySelectorAll(TAB_SELECTOR + subselector));
    };
    /**
     * Calculate the new height, width, and position of the tab indicator.
     * Store the CSS values so the transition animation can start.
     */
    Tabs.prototype.moveSelectionIndicator = function () {
        if (this.tablistElement == null || !this.props.animate) {
            return;
        }
        var tabIdSelector = TAB_SELECTOR + "[data-tab-id=\"" + this.state.selectedTabId + "\"]";
        var selectedTabElement = this.tablistElement.querySelector(tabIdSelector);
        var indicatorWrapperStyle = { display: "none" };
        if (selectedTabElement != null) {
            var clientHeight = selectedTabElement.clientHeight, clientWidth = selectedTabElement.clientWidth, offsetLeft = selectedTabElement.offsetLeft, offsetTop = selectedTabElement.offsetTop;
            indicatorWrapperStyle = {
                height: clientHeight,
                transform: "translateX(" + Math.floor(offsetLeft) + "px) translateY(" + Math.floor(offsetTop) + "px)",
                width: clientWidth,
            };
        }
        this.setState({ indicatorWrapperStyle: indicatorWrapperStyle });
    };
    /** Insert a `Tabs.Expander` between any two children to right-align all subsequent children. */
    Tabs.Expander = Expander;
    Tabs.Tab = Tab;
    Tabs.defaultProps = {
        animate: true,
        large: false,
        renderActiveTabPanelOnly: false,
        vertical: false,
    };
    Tabs.displayName = DISPLAYNAME_PREFIX + ".Tabs";
    return Tabs;
}(AbstractPureComponent));
export { Tabs };
function isEventKeyCode(e) {
    var codes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        codes[_i - 1] = arguments[_i];
    }
    return codes.indexOf(e.which) >= 0;
}
function isTabElement(child) {
    return Utils.isElementOfType(child, Tab);
}
//# sourceMappingURL=tabs.js.map