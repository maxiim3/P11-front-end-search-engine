var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Utility } from "../utils/Utility.js";
import { TagsTemplate } from "../templates/TagsTemplate.js";
export class MenuFilterState {
    constructor(filter) {
        this.filter = filter;
        this.states = { close: new CloseMenu(filter), open: new OpenMenu(filter) };
        this.currentState = this.states["close"];
    }
    setState(state) {
        return (this.currentState = this.states[state]);
    }
    fire() {
        return this.currentState.fire();
    }
}
export class OpenMenu {
    constructor(filter) {
        this.filter = filter;
        this.state = "open";
    }
    setActive() {
        this.filter.dataset.open = "true";
        this.filter.tabIndex = 0;
        this.filter.ariaHidden = "false";
        this.filter.focus();
        this.filter.dataset.color = this.filter.style.backgroundColor;
        const inputSearch = this.filter.querySelector("input");
        const tagWrapper = this.filter.querySelector("ul");
        const $tags = [...tagWrapper.querySelectorAll("li")];
        inputSearch.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
            const query = Utility.removeAccent(inputSearch.value);
            $tags.map(($tag) => __awaiter(this, void 0, void 0, function* () {
                const formatTagName = Utility.removeAccent($tag.innerText);
                if (formatTagName.includes(query))
                    $tag.setAttribute("data-hidden", "false");
                else
                    $tag.setAttribute("data-hidden", "true");
            }));
        }));
        $tags.forEach($tag => {
            $tag.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if ($tag.dataset.active === "false") {
                    const tagTpl = new TagsTemplate($tag);
                    yield tagTpl.appendTag();
                    inputSearch.value = "";
                }
            }));
        });
    }
    fire() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setActive();
        });
    }
}
export class CloseMenu {
    constructor(filter) {
        this.filter = filter;
        this.state = "close";
    }
    setInactive() {
        this.filter.dataset.open = "false";
        this.filter.ariaHidden = "true";
        this.filter.blur();
        const inputSearch = this.filter.querySelector("input");
        const tagWrapper = this.filter.querySelector("ul");
        const $tags = [...tagWrapper.querySelectorAll("li")];
        inputSearch.value = "";
        $tags.forEach($tag => {
            $tag.setAttribute("data-hidden", "false");
        });
    }
    fire() {
        this.setInactive();
    }
}
export class MenuSubject {
    constructor() {
        this.observers = [];
        this.filters = [...document.querySelectorAll(".filtres__filtre")];
        this.filters.forEach(filter => this.observers.push(new MenuFilterState(filter)));
    }
    subscribe(observer) {
        this.observers.filter(filter => filter.filter === observer)[0].setState("open");
        document.addEventListener("keydown", ({ key }) => {
            if (observer.dataset.open === "true") {
                if (key === "Escape" || key === "Enter") {
                    this.unsubscribe(observer);
                    this.fire();
                }
            }
        });
        document.addEventListener("click", ev => {
            if (observer.dataset.open === "true") {
                const mouseProps = this.getMousePosition(ev);
                const containerProps = this.getObserverPosition(observer);
                if (this.mouseInObserver(mouseProps, containerProps)) {
                    return;
                }
                else {
                    this.unsubscribe(observer);
                    this.fire();
                }
            }
        });
    }
    mouseInObserver(mouseProps, containerProps) {
        return (containerProps.positionXLeft < mouseProps.x &&
            mouseProps.x < containerProps.positionXLeft + containerProps.width &&
            containerProps.positionYTop < mouseProps.y &&
            mouseProps.y < containerProps.positionYTop + containerProps.height);
    }
    getObserverPosition(observer) {
        return {
            width: observer.clientWidth,
            height: observer.clientHeight,
            positionXLeft: observer.offsetLeft,
            positionYTop: observer.offsetTop - 10,
        };
    }
    getMousePosition(ev) {
        return {
            x: window.scrollX + ev.clientX,
            y: window.scrollY + ev.clientY,
        };
    }
    unsubscribe(observer) {
        this.observers.filter(filter => filter.filter === observer)[0].setState("close");
    }
    fire() {
        this.observers.forEach(observer => observer.fire());
    }
}
//# sourceMappingURL=MenuFilterState.js.map