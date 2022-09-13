"use strict";
exports.__esModule = true;
exports.MenuSwitcher = void 0;
var TagObserver_1 = require("./TagObserver");
var MenuSwitcher = /** @class */ (function () {
    function MenuSwitcher(btn, parent, data) {
        this.btn = btn;
        this.parent = parent;
        this.data = data;
    }
    MenuSwitcher.prototype.buttonSwitchState = function () {
        var _this = this;
        var _a;
        var btnWrapper = (_a = this.btn) === null || _a === void 0 ? void 0 : _a.parentNode;
        var tags = new TagObserver_1.TagObserver(this.data, btnWrapper);
        this.parent.forEach(function (f) {
            if (f === _this.btn.parentNode) {
                f.dataset.open = "true";
                tags.subscribe(f);
            }
            else {
                f.dataset.open = "false";
                tags.unsubscribe(f);
            }
        });
        tags.fire();
    };
    MenuSwitcher.prototype.update = function () {
        this.buttonSwitchState();
    };
    return MenuSwitcher;
}());
exports.MenuSwitcher = MenuSwitcher;
