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
import { HandleOptionTags } from "./HandleOptionTags.js";
import { ContextState } from "../context/ContextState.js";
export class DomObserver {
    constructor(allReceipts) {
        this.userInput = "";
        this.filteredReceipts = [];
        this.initialReceipts = allReceipts;
        this.$mainSearchBar = document.querySelector("#searchBar");
        this.messageIsDisplayed = false;
    }
    emptyTagContainer() {
        const $tagsContainer = document.querySelector("#tagsWrapper");
        $tagsContainer.innerHTML = "";
    }
    resetOptionTags() {
        const $tagsLI = [...document.querySelectorAll(".filtres__filtre li")];
        $tagsLI.forEach($tag => {
            $tag.setAttribute("data-visible", "true");
            const $tagBtn = $tag.firstChild;
            $tagBtn.disabled = false;
        });
    }
    resetAllCardsVisibility(value) {
        const $allRecettesCards = [...document.querySelectorAll(`.recette`)];
        $allRecettesCards.forEach(recette => {
            recette.dataset.visible = value;
        });
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
    filterByName() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            this.initialReceipts.forEach(recette => {
                if (StringUtility.removeAccent(recette.name).includes(this.userInput))
                    results.push(recette);
            });
            return results;
        });
    }
    filterByDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            this.initialReceipts.forEach(recette => {
                if (StringUtility.removeAccent(recette.description).includes(this.userInput))
                    results.push(recette);
            });
            return results;
        });
    }
    filterIngredients() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            this.initialReceipts.forEach(recette => {
                recette.ingredients.map(({ ingredient }) => {
                    if (StringUtility.removeAccent(ingredient).includes(this.userInput))
                        results.push(recette);
                });
            });
            return results;
        });
    }
    filterByNameV2() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (let i = 0; i < this.initialReceipts.length; i++) {
                const recette = this.initialReceipts[i];
                let testName = StringUtility.removeAccent(recette.name);
                if (testName.includes(this.userInput))
                    results.push(recette);
            }
            return results;
        });
    }
    filterByDescriptionV2() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (let i = 0; i < this.initialReceipts.length; i++) {
                const recette = this.initialReceipts[i];
                if (StringUtility.removeAccent(recette.description).includes(this.userInput))
                    results.push(recette);
            }
            return results;
        });
    }
    filterIngredientsV2() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (let i = 0; i < this.initialReceipts.length; i++) {
                const recette = this.initialReceipts[i];
                const ingredients = recette.ingredients;
                for (const { ingredient } of ingredients) {
                    if (StringUtility.removeAccent(ingredient).includes(this.userInput))
                        results.push(recette);
                }
            }
            return results;
        });
    }
    handleMainFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            const filterByName = yield this.filterByName();
            const filterByDescription = yield this.filterByDescription();
            const filterIngredients = yield this.filterIngredients();
            const allResults = [...filterByName, ...filterByDescription, ...filterIngredients];
            return [...new Set(allResults)];
        });
    }
    onUserInput() {
        return __awaiter(this, void 0, void 0, function* () {
            this.userInput = StringUtility.removeAccent(this.$mainSearchBar.value);
            this.$mainSearchBar.dataset.hasResults !== "false" && this.emptyTagContainer();
            this.filteredReceipts = [];
            this.resetOptionTags();
            if (this.userInput.length > 2) {
                this.filteredReceipts = yield this.handleMainFilter();
                yield this.updateCardsVisibility(this.filteredReceipts);
                yield this.updateFilterOptions(this.filteredReceipts);
                let isResult = this.filteredReceipts.length > 0;
                this.$mainSearchBar.dataset.hasResults = isResult ? "true" : "false";
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
            this.$mainSearchBar.oninput = () => __awaiter(this, void 0, void 0, function* () { return yield this.onUserInput(); });
            this.handleFeedBackMessage();
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
            const wrapper = event.target;
            $1stNode ? wrapper.classList.add("tagInWrapper") : wrapper.classList.remove("tagInWrapper");
            switch (numberOfTags) {
                case 0:
                    yield this.updateCardsVisibility(initialReceipts);
                    yield this.updateFilterOptions(initialReceipts);
                    const openFilter = document.querySelector(".filtres__filtre[data-open='true']");
                    openFilter && new ContextState(openFilter);
                    break;
                case 1:
                    $1stFilter = yield this.filterByTag($1stTag.value, $1stTag.type, initialReceipts);
                    yield this.updateCardsVisibility($1stFilter);
                    yield this.updateFilterOptions($1stFilter);
                    break;
                case 2:
                    $1stFilter = yield this.filterByTag($1stTag.value, $1stTag.type, initialReceipts);
                    yield this.updateCardsVisibility($1stFilter);
                    yield this.updateFilterOptions($1stFilter);
                    $2ndFilter = yield this.filterByTag($2ndTag.value, $2ndTag.type, $1stFilter);
                    yield this.updateCardsVisibility($2ndFilter);
                    yield this.updateFilterOptions($2ndFilter);
                    break;
                case 3:
                    $1stFilter = yield this.filterByTag($1stTag.value, $1stTag.type, initialReceipts);
                    yield this.updateCardsVisibility($1stFilter);
                    yield this.updateFilterOptions($1stFilter);
                    $2ndFilter = yield this.filterByTag($2ndTag.value, $2ndTag.type, $1stFilter);
                    yield this.updateCardsVisibility($2ndFilter);
                    yield this.updateFilterOptions($2ndFilter);
                    $3rdFilter = yield this.filterByTag($3rdTag.value, $3rdTag.type, $2ndFilter);
                    yield this.updateCardsVisibility($3rdFilter);
                    yield this.updateFilterOptions($3rdFilter);
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
    handleFeedBackMessage() {
        const observeFeedBackMessage = new MutationObserver(mutations => {
            const input = mutations[0].target;
            if (input.value.length < 3 || input.dataset.hasResults === "true") {
                this.messageIsDisplayed = false;
                this.emptyTagContainer();
            }
            else if (input.dataset.hasResults === "false" && !this.messageIsDisplayed) {
                const $tagsContainer = document.querySelector("#tagsWrapper");
                this.messageIsDisplayed = true;
                const feedBackMessage = document.createElement("p");
                feedBackMessage.id = "feedBackMessage";
                feedBackMessage.textContent =
                    "« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
                const wait = setTimeout(() => {
                    $tagsContainer.appendChild(feedBackMessage);
                    clearTimeout(wait);
                }, 250);
            }
        });
        observeFeedBackMessage.observe(this.$mainSearchBar, { attributes: true });
    }
}
//# sourceMappingURL=DomObserver.js.map