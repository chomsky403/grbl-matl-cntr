"use strict";
/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReactDOM = tslib_1.__importStar(require("react-dom"));
var errors_1 = require("../../common/errors");
var utils_1 = require("../../common/utils");
var isDarkTheme_1 = require("../../common/utils/isDarkTheme");
var ContextMenu = tslib_1.__importStar(require("./contextMenu"));
function ContextMenuTarget(WrappedComponent) {
    if (!utils_1.isFunction(WrappedComponent.prototype.renderContextMenu)) {
        console.warn(errors_1.CONTEXTMENU_WARN_DECORATOR_NO_METHOD);
    }
    return _a = /** @class */ (function (_super) {
            tslib_1.__extends(ContextMenuTargetClass, _super);
            function ContextMenuTargetClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ContextMenuTargetClass.prototype.render = function () {
                var _this = this;
                var element = _super.prototype.render.call(this);
                if (element == null) {
                    // always return `element` in case caller is distinguishing between `null` and `undefined`
                    return element;
                }
                if (!React.isValidElement(element)) {
                    console.warn(errors_1.CONTEXTMENU_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
                    return element;
                }
                var oldOnContextMenu = element.props.onContextMenu;
                var onContextMenu = function (e) {
                    // support nested menus (inner menu target would have called preventDefault())
                    if (e.defaultPrevented) {
                        return;
                    }
                    if (utils_1.isFunction(_this.renderContextMenu)) {
                        var menu = _this.renderContextMenu(e);
                        if (menu != null) {
                            var darkTheme = isDarkTheme_1.isDarkTheme(ReactDOM.findDOMNode(_this));
                            e.preventDefault();
                            ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, _this.onContextMenuClose, darkTheme);
                        }
                    }
                    utils_1.safeInvoke(oldOnContextMenu, e);
                };
                return React.cloneElement(element, { onContextMenu: onContextMenu });
            };
            return ContextMenuTargetClass;
        }(WrappedComponent)),
        _a.displayName = "ContextMenuTarget(" + utils_1.getDisplayName(WrappedComponent) + ")",
        _a;
    var _a;
}
exports.ContextMenuTarget = ContextMenuTarget;
//# sourceMappingURL=contextMenuTarget.js.map