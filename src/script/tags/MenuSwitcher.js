var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MenuSwitcher_instances, _MenuSwitcher_mousePosition;
import { TagObserver } from "./TagObserver.js";
import { Utility } from "../utils/Utility.js";
export class MenuSwitcher {
    constructor(btn) {
        _MenuSwitcher_instances.add(this);
        this.disableContainer = (container) => {
            container.dataset.open = "false";
            container.ariaHidden = "true";
            container.blur();
            container.removeEventListener("click", () => this.handleFocusEvent(this));
        };
        this.btn = btn;
        this.tagContainers = [...document.querySelectorAll(".filtres__filtre")];
        this.buttonParentContext = this.btn.parentElement;
        this.TagObserver = new TagObserver(this.buttonParentContext);
    }
    handleFilterMenuState() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleOtherContainers();
            yield this.handleSelectedContainer();
            this.TagObserver.fire();
        });
    }
    handleOtherContainers() {
        this.tagContainers
            .filter(tagContainer => tagContainer !== this.buttonParentContext)
            .forEach(container => {
            this.disableContainer(container);
            this.TagObserver.unsubscribe(container);
        });
    }
    handleSelectedContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setContainerActive();
            this.TagObserver.subscribe(this.buttonParentContext);
            yield this.buttonParentContext.addEventListener("click", () => this.handleFocusEvent(this));
        });
    }
    setContainerActive() {
        this.buttonParentContext.dataset.open = "true";
        this.buttonParentContext.tabIndex = 0;
        this.buttonParentContext.ariaHidden = "false";
        this.buttonParentContext.focus();
        this.buttonParentContext.dataset.color = this.buttonParentContext.style.backgroundColor;
    }
    handleFocusEvent(that) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Utility.delay(250);
            const containerProps = {
                width: that.buttonParentContext.clientWidth,
                height: that.buttonParentContext.clientHeight,
                positionXLeft: that.buttonParentContext.offsetLeft,
                positionYTop: that.buttonParentContext.offsetTop - 10,
            };
            document.addEventListener("mousemove", ev => __classPrivateFieldGet(this, _MenuSwitcher_instances, "m", _MenuSwitcher_mousePosition).call(this, ev, containerProps, that));
            that.disableContainer(that.buttonParentContext);
            that.TagObserver.unsubscribe(that.buttonParentContext);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleFilterMenuState();
        });
    }
}
_MenuSwitcher_instances = new WeakSet(), _MenuSwitcher_mousePosition = function _MenuSwitcher_mousePosition(ev, { height, positionXLeft, positionYTop, width }, that) {
    const mouseProps = {
        x: window.scrollX + ev.clientX,
        y: window.scrollY + ev.clientY,
    };
    if (positionXLeft < mouseProps.x &&
        mouseProps.x < positionXLeft + width &&
        positionYTop < mouseProps.y &&
        mouseProps.y < positionYTop + height)
        that.buttonParentContext.style.backgroundColor = "gray";
    else {
        const currentColor = that.buttonParentContext.dataset.color;
        that.buttonParentContext.style.backgroundColor = CSS.escape(currentColor);
    }
};
//# sourceMappingURL=MenuSwitcher.js.map