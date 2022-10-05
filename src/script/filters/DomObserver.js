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
import { HandleOptionTags } from "../templates/HandleOptionTags.js";
export class DomObserver {
    constructor(allReceipts) {
        this.userInput = "";
        this.filteredReceipts = [];
        this.initialReceipts = allReceipts;
        this.$mainSearchBar = document.querySelector("#searchBar");
    }
    emptyTagContainer() {
        const $tagsContainer = document.querySelector("#tagsWrapper");
        $tagsContainer.innerHTML = "";
    }
    resetAllCardsVisibility(value) {
        const $allRecettesCards = [...document.querySelectorAll(`.recette`)];
        $allRecettesCards.forEach(recette => (recette.dataset.visible = value));
    }
    resetAllOptionsVisibility(value) {
        const allLIElement = [...document.querySelectorAll("#filtres li")];
        allLIElement.forEach(li => {
            li.dataset.visible = value;
        });
    }
    updateCardsVisibility() {
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
    updateFilterOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetAllOptionsVisibility("false");
            const newInstance = new HandleOptionTags(this.filteredReceipts);
            const promesse = yield newInstance.getAllOptionTags();
            const allFilteredTags = [[...promesse.appliance], [...promesse.ingredients], [...promesse.ustensiles]];
            allFilteredTags.forEach(filterType => {
                filterType.forEach(optionTag => {
                    const typeToString = allFilteredTags.indexOf(filterType) === 0
                        ? "appliance"
                        : allFilteredTags.indexOf(filterType) === 1
                            ? "ingredients"
                            : "ustensiles";
                    const parentSelector = `.filtres__list[data-filter-name=\"${CSS.escape(typeToString)}\"]`;
                    const parentNode = document.querySelector(parentSelector);
                    const applianceSelector = `li[data-value=\"${CSS.escape(StringUtility.removeAccent(optionTag))}\"]`;
                    const optionNode = parentNode.querySelector(applianceSelector);
                    optionNode.dataset.visible = "true";
                });
            });
            console.log("la reponse est 42");
        });
    }
    mainFilterByType(type) {
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
    handleMainFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            const filterByName = yield this.mainFilterByType("name");
            if (filterByName.length > 0)
                return filterByName;
            else {
                const filterByDescription = yield this.mainFilterByType("description");
                if (filterByDescription.length > 0)
                    return filterByDescription;
                else {
                    const filterIngredients = yield this.mainFilterByType("ingredients");
                    if (filterIngredients.length > 0)
                        return filterIngredients;
                    else
                        return [];
                }
            }
        });
    }
    userInputEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            this.userInput = StringUtility.removeAccent(this.$mainSearchBar.value);
            this.filteredReceipts = [];
            this.emptyTagContainer();
            if (this.userInput.length > 2) {
                this.filteredReceipts = yield this.handleMainFilter();
                this.$mainSearchBar.dataset.hasResults = this.filteredReceipts.length > 0 ? "true" : "false";
                yield this.updateCardsVisibility();
                yield this.updateFilterOptions();
            }
            else {
                this.resetAllCardsVisibility("true");
                this.resetAllOptionsVisibility("true");
                this.$mainSearchBar.dataset.hasResults = "empty";
            }
        });
    }
    observeDomChange() {
        return __awaiter(this, void 0, void 0, function* () {
            this.$mainSearchBar.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () { return yield this.userInputEvent(); }));
            return this.filteredReceipts;
        });
    }
}
//# sourceMappingURL=DomObserver.js.map