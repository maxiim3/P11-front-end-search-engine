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
export class TagHandler {
    static handleDropDownMenuFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            const filterButtons = [...document.querySelectorAll(".filtres__button")];
            filterButtons.forEach(btn => {
                btn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
                    e.preventDefault();
                }));
            });
        });
    }
    static removeTagQueries() {
        const $allTags = [...document.querySelectorAll(".filtres__list li")];
        const $tagsContainer = document.querySelector("#tagsWrapper");
        if ($tagsContainer.childNodes) {
            const $selectedTags = [...$tagsContainer.childNodes];
            $selectedTags.forEach($selectedTag => {
                $allTags
                    .filter(li => li.textContent === $selectedTag.textContent)
                    .forEach(li => {
                    li.dataset.active = "false";
                    li.dataset.hidden = "false";
                    li.setAttribute("disabled", "false");
                });
                $tagsContainer.removeChild($selectedTag);
            });
        }
    }
    static handleSearchForTags(selectedTagContainer) {
        return __awaiter(this, void 0, void 0, function* () {
            const ulElement = selectedTagContainer.querySelector("ul");
            const type = ulElement.dataset.filterName;
            const inputElement = selectedTagContainer.querySelector("input");
            const inputQuery = inputElement.value;
            console.log(inputQuery);
            const pattern = new RegExp(inputQuery, "gi");
            const selection = `ul[data-filter-name=${CSS.escape(type)}] li`;
            const $tags = [...document.querySelectorAll(selection)];
            if (inputQuery.length === 0)
                $tags.map(tag => tag.setAttribute("data-hidden", "false"));
            else {
                $tags.map(tag => {
                    const value = tag.value.toString().toLowerCase();
                    if (pattern.test(value))
                        tag.setAttribute("data-hidden", "false");
                    else
                        tag.setAttribute("data-hidden", "true");
                });
            }
            return [...document.querySelectorAll(selection + "[data-hidden=false]")];
        });
    }
    static handleClickOnTags(tags, selectedTagContainer) {
        tags.forEach($tag => {
            $tag.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if ($tag.dataset.active === "false") {
                    const tagTpl = new TagsTemplate($tag);
                    yield tagTpl.appendTag();
                    yield TagHandler.handleSearchForTags(selectedTagContainer);
                    const firstParent = $tag.parentElement;
                    const divContext = firstParent.parentElement;
                    const inputSearch = divContext.querySelector("input");
                    inputSearch.value = "";
                }
            }));
        });
    }
    static getAllTags(observer) {
        return [...observer.querySelectorAll("li:not([data-hidden=true])")];
    }
}
//# sourceMappingURL=TagHandler.js.map