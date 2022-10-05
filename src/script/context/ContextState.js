var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TagsTemplate } from "../templates/TagsTemplate.js";
import { StringUtility } from "../utils/StringUtility.js";
import { MouseUtility } from "../utils/MouseUtility.js";
export class ContextState {
    constructor(filter) {
        this.filter = filter;
        this.$tagsContainer = document.querySelector("#tagsWrapper");
        this.$filterUL = this.filter.querySelector("ul");
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
        const inputSearch = this.filter.querySelector("input");
        inputSearch.value = "";
        const mainInput = document.querySelector("#searchBar");
        if (mainInput.value.length < 3) {
            this.$tagsLI.forEach($tag => {
                $tag.setAttribute("data-visible", "true");
            });
        }
        this.inputSearch.removeEventListener("input", this.handleSearchForTags);
        this.filter.removeEventListener("keydown", this.closeOnKeyPress);
        this.filter.removeEventListener("click", this.closeOnClick);
    }
    setActive() {
        this.filter.dataset.open = "true";
        this.filter.tabIndex = 0;
        this.filter.ariaHidden = "false";
        this.inputSearch.addEventListener("input", this.handleSearchForTags);
        document.addEventListener("keydown", this.closeOnKeyPress);
        document.addEventListener("click", this.closeOnClick);
        this.$tagsLI.forEach($tag => {
            const tagBtn = $tag.firstChild;
            tagBtn.onclick = () => {
                this.appendTagToContainer(tagBtn);
            };
        });
    }
    handleSearchForTags() {
        if (this instanceof HTMLInputElement) {
            const inputSearch = this;
            const openFilter = document.querySelector(".filtres__filtre[data-open='true']");
            if (openFilter) {
                const $tagsLI = openFilter && [...openFilter.querySelectorAll("li")];
                const query = StringUtility.removeAccent(inputSearch.value);
                $tagsLI.map(($tag) => __awaiter(this, void 0, void 0, function* () {
                    const innerBtn = $tag.querySelector("button");
                    const formatTagName = innerBtn && StringUtility.removeAccent(innerBtn.value);
                    if (formatTagName && formatTagName.includes(query))
                        $tag.setAttribute("data-visible", "true");
                    else
                        $tag.setAttribute("data-visible", "false");
                }));
            }
        }
    }
    appendTagToContainer(tagBtn) {
        const { value, dataset } = tagBtn;
        const tagTemplate = new TagsTemplate({ value, dataset });
        if (this.$tagsContainer.childNodes.length < 3) {
            tagBtn.disabled = true;
            tagBtn.disabled = true;
            const $newTag = tagTemplate.createTag();
            this.$tagsContainer.appendChild($newTag);
            const $closeTag = $newTag.querySelector(".tag__btn");
            $closeTag.onclick = () => {
                tagBtn.disabled = false;
                this.$tagsContainer.removeChild($newTag);
            };
            return $newTag;
        }
        return;
    }
    closeOnKeyPress(e) {
        const openFilter = document.querySelector(".filtres__filtre[data-open='true']");
        if ((openFilter === null || openFilter === void 0 ? void 0 : openFilter.dataset.open) === "true") {
            if (e.key === "Escape" || e.key === "Enter") {
                new ContextState(openFilter);
                openFilter.blur();
            }
        }
    }
    closeOnClick(ev) {
        const openFilter = document.querySelector(".filtres__filtre[data-open='true']");
        if ((openFilter === null || openFilter === void 0 ? void 0 : openFilter.dataset.open) === "true") {
            const mouseProps = MouseUtility.getMousePosition(ev);
            const containerProps = MouseUtility.getObserverPosition(openFilter);
            if (MouseUtility.mouseInObserver(mouseProps, containerProps)) {
                return;
            }
            else {
                window.scroll(0, 0);
                openFilter.blur();
                new ContextState(openFilter);
            }
        }
    }
}
//# sourceMappingURL=ContextState.js.map