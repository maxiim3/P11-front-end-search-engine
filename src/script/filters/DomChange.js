var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StringUtility } from "../utils/StringUtility.js";
export class DomChange {
    constructor(allReceipts) {
        this.userInput = "";
        this.filteredReceipts = [];
        this.initialReceipts = allReceipts;
        this.$mainSearchBar = document.querySelector("#searchBar");
    }
    searchBarObserver() {
        return __awaiter(this, void 0, void 0, function* () {
            this.userInput = StringUtility.removeAccent(this.$mainSearchBar.value);
            this.filteredReceipts = [];
            this.emptyTagContainer();
            if (this.userInput.length > 2) {
                this.filteredReceipts = yield this.mainFilter();
                this.$mainSearchBar.dataset.hasResults = this.filteredReceipts.length > 0 ? "true" : "false";
                yield this.updateRecettesCards();
            }
            else {
                this.resetAllCardsVisibility("true");
                this.$mainSearchBar.dataset.hasResults = "empty";
            }
        });
    }
    emptyTagContainer() {
        const $tagsContainer = document.querySelector("#tagsWrapper");
        $tagsContainer.innerHTML = "";
    }
    resetAllCardsVisibility(value) {
        const $allRecettesCards = [...document.querySelectorAll(`.recette`)];
        $allRecettesCards.forEach(recette => (recette.dataset.visible = value));
    }
    updateRecettesCards() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetAllCardsVisibility("false");
            this.filteredReceipts.forEach(({ id }) => {
                const $nodeId = CSS.escape(id.toString());
                const selector = `.recette[data-id ="${$nodeId}"]`;
                const $recetteNode = document.querySelector(selector);
                $recetteNode.dataset.visible = "true";
            });
        });
    }
    mainFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            const filterByName = yield this.searchBy("name");
            if (filterByName.length > 0)
                return filterByName;
            else {
                const filterByDescription = yield this.searchBy("description");
                if (filterByDescription.length > 0)
                    return filterByDescription;
                else {
                    const filterIngredients = yield this.searchBy("ingredients");
                    if (filterIngredients.length > 0)
                        return filterIngredients;
                    else
                        return [];
                }
            }
        });
    }
    searchBy(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            switch (type) {
                case "name":
                    this.initialReceipts.forEach(recette => {
                        if (StringUtility.removeAccent(recette.name).includes(this.userInput))
                            results.push(recette);
                    });
                    return results;
                case "description":
                    this.initialReceipts.forEach(recette => {
                        if (StringUtility.removeAccent(recette.description).includes(this.userInput))
                            results.push(recette);
                    });
                    return results;
                case "ingredients":
                    this.initialReceipts.forEach(recette => {
                        recette.ingredients.map(({ ingredient }) => {
                            if (StringUtility.removeAccent(ingredient).includes(this.userInput))
                                results.push(recette);
                        });
                    });
                    return results;
                default:
                    return results;
            }
        });
    }
    observeDomChange() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$mainSearchBar.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () { return yield this.searchBarObserver(); }));
            return this.filteredReceipts;
        });
    }
}
//# sourceMappingURL=DomChange.js.map