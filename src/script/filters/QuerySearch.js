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
import { FilterV1 } from "../utils/FilterV1.js";
export class QuerySearch {
    constructor(allReceipts) {
        this._recettes = allReceipts;
        this.$mainSearchBar = document.querySelector("#searchBar");
        this.$tagsContainer = document.querySelector("#tagsWrapper");
        this.recettesFilteredByQueries = [];
        this.recettesFilteredByTags = [];
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
            if (this.recettesFilteredByQueries.length > 0)
                return this.recettesFilteredByQueries;
            else
                return this.recettes;
        });
    }
    dataByQueryTags() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.recettesFilteredByTags.length > 0)
                return this.recettesFilteredByTags;
            else
                yield this.dataByQuerySearch();
        });
    }
    observerSearchBar() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$mainSearchBar.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                this.input = Utility.removeAccent(this.$mainSearchBar.value);
                this.selectedTags = [];
                this.recettesFilteredByQueries = [];
                this.recettesFilteredByTags = [];
                this.$tagsContainer.innerHTML = "";
                if (this.input.length > 2) {
                    const Filter = new FilterV1(this.recettes, this.keyWords);
                    this.recettesFilteredByQueries = yield Filter.filterBySearch();
                    yield DomFactoryMethods.resetDom();
                    yield DomFactoryMethods.renderDOM(this.recettesFilteredByQueries);
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
                this.recettesFilteredByTags = [];
                if (tags.length !== 0) {
                    tags.forEach(tag => this.selectedTags.push(tag));
                    const Filter = new FilterV1(yield this.dataByQuerySearch(), this.keyWords);
                    this.recettesFilteredByTags = yield Filter.filterByTags();
                    yield DomFactoryMethods.resetDom();
                    yield DomFactoryMethods.renderDOM(this.recettesFilteredByTags);
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
            return yield this.dataByQueryTags();
        });
    }
}
//# sourceMappingURL=QuerySearch.js.map