"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
class App {
    constructor() {
        this.keyWords = {
            input: "",
            tags: [],
        };
        this.handleTagSelection = () => __awaiter(this, void 0, void 0, function* () {
            const buttons = [...document.querySelectorAll(".filtres__button")];
            const filters = [...document.querySelectorAll(".filtres__filtre")];
            buttons.forEach(btn => {
                const switcher = new MenuSwitcher(btn, filters, this.initialData);
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    switcher.update();
                });
            });
        });
        this.url = "data/recipes.json";
        this.api = new Api(this.url);
        this.initialData = [];
        this.dataFilteredByTags = [];
    }
    removeTags() {
        const $allTags = [...document.querySelectorAll(".filtres__list li")];
        const $tagsContainer = document.querySelector("#tagsWrapper");
        const $selectedTags = [...$tagsContainer.querySelectorAll(".tag")];
        this.dataFilteredByTags = [];
        $selectedTags.forEach((tag) => {
            if (tag) {
                $allTags.filter(li => {
                    if (li.textContent === tag.textContent) {
                        li.dataset.active = "false";
                        li.dataset.hidden = "false";
                        li.setAttribute("disabled", "false");
                        $tagsContainer.removeChild(li);
                    }
                });
            }
        });
    }
    globalObserver() {
        const config = {
            attributes: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true,
        };
        // todo faire le filtrage global dans le filtres pour keywords
        const observerSearchBar = () => {
            const $mainSearchBar = document.querySelector("#searchBar");
            $mainSearchBar.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                this.removeTags();
                this.keyWords.input = $mainSearchBar.value;
                yield FilterKeyWords();
            }));
        };
        const observerTagContainer = () => {
            const $tagsContainer = document.querySelector("#tagsWrapper");
            const observer = new MutationObserver((mutationRecords) => __awaiter(this, void 0, void 0, function* () {
                const tags = [...mutationRecords[0].target.childNodes];
                this.keyWords.tags = [];
                console.log(typeof tags);
                // tags.forEach(tag => this.keyWords.tags.push(tag))
                yield FilterKeyWords();
            }));
            observer.observe($tagsContainer, config);
        };
        const FilterKeyWords = () => __awaiter(this, void 0, void 0, function* () {
            const { input, tags } = this.keyWords;
            const dataFilteredByMainSearch = yield FilterV1.mainFilter(this.initialData, input);
            if (tags.length > 0) {
                for (const tag of tags) {
                    const data = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : dataFilteredByMainSearch;
                    this.dataFilteredByTags = yield FilterV1.advancedFilter(data, tag);
                }
            }
            const outputData = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : dataFilteredByMainSearch;
            console.log(outputData);
            yield DomFactory.resetDom();
            return yield DomFactory.renderDOM(outputData);
        });
        observerSearchBar();
        observerTagContainer();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initialData = yield this.api.fetch();
            yield DomFactory.renderDOM(this.initialData);
            yield this.handleTagSelection();
            this.globalObserver();
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map