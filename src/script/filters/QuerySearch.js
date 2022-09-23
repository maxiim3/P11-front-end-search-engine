var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DomFactoryMethods } from "../templates/DomFactoryMethods.js";
import { Utility } from "../utils/Utility.js";
import { FilterV1 } from "../utils/FilterV1";
export class QuerySearch {
    constructor(allReceipts) {
        this._recettes = allReceipts;
        this.$mainSearchBar = document.querySelector("#searchBar");
        this.$tagsContainer = document.querySelector("#tagsWrapper");
        this.resultsFromQuerySearch = [];
        this.resultsFromQueryTags = [];
        this.selectedTags = [];
        this.input = "";
    }
    get recettes() {
        return this._recettes;
    }
    get keyWords() {
        return { input: this.input, tags: this.selectedTags };
    }
    get config() {
        return {
            attributes: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true,
        };
    }
    dataByQuerySearch() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.resultsFromQuerySearch.length > 0)
                return this.resultsFromQuerySearch;
            else
                return this.recettes;
        });
    }
    dataByQueryTags() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.resultsFromQueryTags.length > 0)
                return this.resultsFromQueryTags;
            else
                yield this.dataByQuerySearch();
        });
    }
    observerSearchBar() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$mainSearchBar.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                this.input = Utility.removeAccent(this.$mainSearchBar.value);
                this.selectedTags = [];
                this.resultsFromQuerySearch = [];
                this.resultsFromQueryTags = [];
                this.$tagsContainer.innerHTML = "";
                if (this.input.length > 2) {
                    const Filter = new FilterV1(this.recettes, this.keyWords);
                    this.resultsFromQuerySearch = yield Filter.filterBySearch();
                    yield DomFactoryMethods.resetDom();
                    yield DomFactoryMethods.renderDOM(this.resultsFromQuerySearch);
                }
                else {
                    yield DomFactoryMethods.resetDom();
                    yield DomFactoryMethods.renderDOM(this.recettes);
                }
            }));
        });
    }
    observerTagContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            const observer = new MutationObserver((mutationRecords) => __awaiter(this, void 0, void 0, function* () {
                const tags = [...mutationRecords[0].target.childNodes];
                this.selectedTags = [];
                this.resultsFromQueryTags = [];
                if (tags.length !== 0) {
                    tags.forEach(tag => this.selectedTags.push(tag));
                    const Filter = new FilterV1(yield this.dataByQuerySearch(), this.keyWords);
                    this.resultsFromQueryTags = yield Filter.filterByTags();
                    yield DomFactoryMethods.resetDom();
                    yield DomFactoryMethods.renderDOM(this.resultsFromQueryTags);
                }
                else {
                    yield DomFactoryMethods.resetDom();
                    yield DomFactoryMethods.renderDOM(yield this.dataByQuerySearch());
                }
            }));
            observer.observe(this.$tagsContainer, this.config);
        });
    }
    observeDomChange() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.observerSearchBar();
            yield this.observerTagContainer();
            return yield this.dataByQueryTags();
        });
    }
}
//# sourceMappingURL=QuerySearch.js.map