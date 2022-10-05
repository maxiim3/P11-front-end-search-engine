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
    updateCardsVisibility(recettes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetAllCardsVisibility("false");
            recettes.forEach(({ id }) => {
                const $nodeId = CSS.escape(id.toString());
                const selector = `.recette[data-id ="${$nodeId}"]`;
                const $recetteNode = document.querySelector(selector);
                $recetteNode.dataset.visible = "true";
            });
        });
    }
    updateFilterOptions(recettes) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetAllOptionsVisibility("false");
            const newInstance = new HandleOptionTags(recettes);
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
                console.log(this.filteredReceipts);
                yield this.updateCardsVisibility(this.filteredReceipts);
                yield this.updateFilterOptions(this.filteredReceipts);
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
            this.$mainSearchBar.oninput = () => __awaiter(this, void 0, void 0, function* () { return yield this.userInputEvent(); });
            const $tagsContainer = document.querySelector("#tagsWrapper");
            const observer = new MutationObserver((mutations) => __awaiter(this, void 0, void 0, function* () { return yield this.observerTagContainer(mutations); }));
            observer.observe($tagsContainer, { childList: true });
            return this.filteredReceipts;
        });
    }
    observerTagContainer(mutations) {
        return __awaiter(this, void 0, void 0, function* () {
            let initialReceipts = this.filteredReceipts.length > 0 ? this.filteredReceipts : this.initialReceipts;
            let $1stFilter;
            let $2ndFilter;
            let $3rdFilter;
            const event = mutations[0];
            const children = [...event.target.childNodes];
            const numberOfTags = children.length;
            const $1stNode = children[0];
            const $1stTag = {
                value: $1stNode && StringUtility.removeAccent($1stNode.textContent),
                type: $1stNode && $1stNode.dataset.tag,
            };
            const $2ndNode = children[1];
            const $2ndTag = {
                value: $2ndNode && StringUtility.removeAccent($2ndNode.textContent),
                type: $2ndNode && $2ndNode.dataset.tag,
            };
            const $3rdNode = children[2];
            const $3rdTag = {
                value: $3rdNode && StringUtility.removeAccent($3rdNode.textContent),
                type: $3rdNode && $3rdNode.dataset.tag,
            };
            switch (numberOfTags) {
                case 0:
                    console.log("0 tag");
                    yield this.updateCardsVisibility(initialReceipts);
                    yield this.updateFilterOptions(initialReceipts);
                    break;
                case 1:
                    console.log("1 tag");
                    $1stFilter = yield this.filterByTag($1stTag.value, $1stTag.type, initialReceipts);
                    yield this.updateCardsVisibility($1stFilter);
                    yield this.updateFilterOptions($1stFilter);
                    console.log($1stFilter);
                    break;
                case 2:
                    console.log("2 tag");
                    $1stFilter = yield this.filterByTag($1stTag.value, $1stTag.type, initialReceipts);
                    yield this.updateCardsVisibility($1stFilter);
                    yield this.updateFilterOptions($1stFilter);
                    $2ndFilter = yield this.filterByTag($2ndTag.value, $2ndTag.type, $1stFilter);
                    yield this.updateCardsVisibility($2ndFilter);
                    yield this.updateFilterOptions($2ndFilter);
                    console.log($1stFilter);
                    console.log($2ndFilter);
                    break;
                case 3:
                    console.log("3 tag");
                    $1stFilter = yield this.filterByTag($1stTag.value, $1stTag.type, initialReceipts);
                    yield this.updateCardsVisibility($1stFilter);
                    yield this.updateFilterOptions($1stFilter);
                    $2ndFilter = yield this.filterByTag($2ndTag.value, $2ndTag.type, $1stFilter);
                    yield this.updateCardsVisibility($2ndFilter);
                    yield this.updateFilterOptions($2ndFilter);
                    $3rdFilter = yield this.filterByTag($3rdTag.value, $3rdTag.type, $2ndFilter);
                    yield this.updateCardsVisibility($3rdFilter);
                    yield this.updateFilterOptions($3rdFilter);
                    console.log($1stFilter);
                    console.log($2ndFilter);
                    console.log($3rdFilter);
                    break;
                default:
                    break;
            }
        });
    }
    filterByTag(value, type, recettes) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            switch (type) {
                case "appliance":
                    recettes.forEach(recette => {
                        if (StringUtility.removeAccent(recette.appliance).includes(value))
                            results.push(recette);
                    });
                    return results;
                case "ustensiles":
                    recettes.forEach(recette => {
                        recette.ustensiles.map(ustensile => {
                            if (StringUtility.removeAccent(ustensile).includes(value))
                                results.push(recette);
                        });
                    });
                    return results;
                case "ingredients":
                    recettes.forEach(recette => {
                        recette.ingredients.map(({ ingredient }) => {
                            if (StringUtility.removeAccent(ingredient).includes(value))
                                results.push(recette);
                        });
                    });
                    return results;
                default:
                    return results;
            }
        });
    }
}
//# sourceMappingURL=DomObserver.js.map