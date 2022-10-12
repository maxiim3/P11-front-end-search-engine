var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TagsTemplate } from "../views/TagsTemplate.js";
import { StringUtility } from "../utils/StringUtility.js";
import { MouseUtility } from "../utils/MouseUtility.js";
export class ContextState {
    constructor(filter) {
        var _a;
        this.resetFilterInput = () => (this.inputSearch.value = "");
        this.filter = filter;
        this.$tagsContainer = document.querySelector("#tagsWrapper");
        this.$filterUL = (_a = this.filter) === null || _a === void 0 ? void 0 : _a.querySelector("ul");
        this.$tagsLI = [...this.$filterUL.querySelectorAll("li")];
        this.inputSearch = this.filter.querySelector("input");
        this.currentState = "close";
        this.setState("close");
    }
    setState(state) {
        switch (state) {
            case "open":
                this.setActive();
                break;
            case "close":
                this.setInactive();
                break;
        }
        return (this.currentState = state);
    }
    setInactive() {
        this.filter.dataset.open = "false";
        this.filter.ariaHidden = "true";
        this.filter.blur();
        this.resetFilterInput();
        window.scroll(0, 0);
        this.inputSearch.removeEventListener("input", this.handleSearchForTags);
        this.filter.removeEventListener("keydown", this.closeOnKeyPress);
        this.filter.removeEventListener("click", this.closeOnClick);
        this.$tagsLI.forEach($tag => {
            $tag.classList.remove("fadeIn");
            $tag.classList.add("fadeOut");
        });
    }
    setActive() {
        this.filter.dataset.open = "true";
        this.filter.tabIndex = 0;
        this.filter.ariaHidden = "false";
        this.inputSearch.addEventListener("input", this.handleSearchForTags);
        document.addEventListener("keydown", this.closeOnKeyPress);
        document.addEventListener("click", this.closeOnClick);
        this.$tagsLI.forEach($tag => {
            $tag.classList.remove("fadeOut");
            $tag.classList.add("fadeIn");
            const tagBtn = $tag.firstChild;
            tagBtn.onclick = () => {
                this.appendTagToContainer(tagBtn);
            };
        });
    }
    handleSearchForTags() {
        if (this instanceof HTMLInputElement) {
            const inputSearch = this;
            const openFilter = document.querySelector(".filtres__filtre[api-open='true']");
            if (openFilter) {
                const $tagsLI = openFilter && [...openFilter.querySelectorAll("li")];
                const query = StringUtility.removeAccent(inputSearch.value);
                $tagsLI.forEach(($tag) => __awaiter(this, void 0, void 0, function* () {
                    const innerBtn = $tag.querySelector("button");
                    const formatTagName = innerBtn && StringUtility.removeAccent(innerBtn.value);
                    if (query.length === 0) {
                        $tag.dataset.visible = $tag.dataset.active === "true" ? "true" : "false";
                    }
                    if (formatTagName && formatTagName.includes(query) && $tag.dataset.active === "true")
                        $tag.setAttribute("api-visible", "true");
                    else
                        $tag.setAttribute("api-visible", "false");
                }));
            }
        }
    }
    appendTagToContainer(tagBtn) {
        const { value, dataset } = tagBtn;
        const tagTemplate = new TagsTemplate({ value, dataset });
        if (this.$tagsContainer.childNodes.length < 3) {
            this.resetFilterInput();
            tagBtn.disabled = true;
            const $newTag = tagTemplate.createTag();
            this.$tagsContainer.appendChild($newTag);
            $newTag.classList.remove("fadeOutWithAnimation");
            $newTag.classList.add("fadeIn");
            const $closeTag = $newTag.querySelector(".tag__btn");
            $closeTag.onclick = () => {
                tagBtn.disabled = false;
                $newTag.classList.remove("fadeIn");
                $newTag.classList.add("fadeOutWithAnimation");
                const wait = setTimeout(() => {
                    this.$tagsContainer.removeChild($newTag);
                    clearTimeout(wait);
                }, 350);
            };
            return $newTag;
        }
        return;
    }
    closeOnKeyPress(e) {
        const openFilter = document.querySelector(".filtres__filtre[api-open='true']");
        if ((openFilter === null || openFilter === void 0 ? void 0 : openFilter.dataset.open) === "true") {
            if (e.key === "Escape" || e.key === "Enter") {
                new ContextState(openFilter);
            }
        }
    }
    closeOnClick(ev) {
        const openFilter = document.querySelector(".filtres__filtre[api-open='true']");
        if ((openFilter === null || openFilter === void 0 ? void 0 : openFilter.dataset.open) === "true") {
            const pointerPosition = MouseUtility.getMousePosition(ev);
            const divPosition = MouseUtility.getDivElementPosition(openFilter);
            if (MouseUtility.mouseInObserver(pointerPosition, divPosition)) {
                return;
            }
            else {
                new ContextState(openFilter);
            }
        }
    }
}
//# sourceMappingURL=ContextState.js.map