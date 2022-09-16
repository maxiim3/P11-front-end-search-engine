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
const fetchData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = yield fetch(url);
    const output = yield promise.json();
    return output;
});
class App {
    constructor() {
        this.handleTagSelection = (data) => __awaiter(this, void 0, void 0, function* () {
            const buttons = [...document.querySelectorAll(".filtres__button")];
            const filters = [...document.querySelectorAll(".filtres__filtre")];
            buttons.forEach(btn => {
                const switcher = new MenuSwitcher(btn, filters, data);
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    switcher.update();
                });
            });
        });
    }
    mapData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data.map((d) => new Recette(d));
        });
    }
    removeTags() {
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
    globalObserver(allData) {
        // console.log(allData)
        const keyWords = {
            input: "",
            tags: [],
        };
        const observerSearchBar = () => {
            const $mainSearchBar = document.querySelector("#searchBar");
            $mainSearchBar.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                this.removeTags();
                keyWords.input = $mainSearchBar.value.toLowerCase();
                const filteredData = yield FilterKeyWords();
                yield DomFactory.resetDom();
                yield DomFactory.renderDOM(filteredData);
            }));
        };
        const FilterKeyWords = () => __awaiter(this, void 0, void 0, function* () {
            const { input, tags } = keyWords;
            const regExp = new RegExp(input, "gi");
            const dataThroughFirstFilter = [];
            // const dataThroughSecondFilter: Recette[] = []
            allData.filter(card => regExp.test(card.name) && dataThroughFirstFilter.push(card));
            allData.filter(card => regExp.test(card.description) && dataThroughFirstFilter.push(card));
            allData.map(card => {
                card.getIngredients.forEach(({ ingredient }) => {
                    if (regExp.test(ingredient))
                        dataThroughFirstFilter.push(card);
                });
            });
            const filteredData = dataThroughFirstFilter.length > 0 ? [...new Set(dataThroughFirstFilter)] : [...allData];
            if (!!tags) {
                const allTags = [...tags];
                const output = [];
                const filterRec = yield recursiveFiltering(filteredData, allTags, output);
                console.log(filterRec);
                function recursiveFiltering(data, tags, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (tags.length === 0) {
                            if (result.length === 0)
                                return data;
                            return result;
                        }
                        else {
                            const tagValue = tags[0].textContent;
                            const pattern = new RegExp(tagValue.toLowerCase(), "gi");
                            const tagType = tags[0].dataset.tag;
                            data.forEach(card => {
                                switch (tagType) {
                                    case "ingredients":
                                        card.getIngredients.forEach(({ ingredient }) => {
                                            if (pattern.test(ingredient))
                                                result.push(card);
                                        });
                                        break;
                                    case "appliance":
                                        if (pattern.test(card.appliance))
                                            result.push(card);
                                        break;
                                    case "ustensiles":
                                        card.ustensiles.forEach(ustensile => {
                                            if (pattern.test(ustensile))
                                                result.push(card);
                                        });
                                        break;
                                }
                            });
                            const res = [...new Set(result)];
                            const newTags = tags.length > 0 ? tags.shift() : [];
                            newTags.length > 0 && (yield recursiveFiltering(data, newTags, res));
                        }
                    });
                }
            }
            // console.log([...new Set(dataThroughSecondFilter)])
            return [...new Set(dataThroughFirstFilter)] || allData;
            /*	if (filterByName) return filterByName
             else if (filterByDesc) return filterByDesc
             else if (filterByIngredients) return filterByIngredients
             else return allData*/
        });
        const observerTagContainer = () => {
            const config = {
                attributes: true,
                characterDataOldValue: true,
                childList: true,
                subtree: true,
            };
            const $tagsContainer = document.querySelector("#tagsWrapper");
            const observer = new MutationObserver((mutationRecords) => __awaiter(this, void 0, void 0, function* () {
                const tags = [...mutationRecords[0].target.childNodes];
                keyWords.tags = [];
                tags.forEach(tag => keyWords.tags.push(tag));
                yield FilterKeyWords();
            }));
            observer.observe($tagsContainer, config);
        };
        observerSearchBar();
        observerTagContainer();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const initialData = yield fetchData("/src/data/recipes.json");
            const allReceipts = yield this.mapData(initialData);
            yield DomFactory.renderDOM(allReceipts);
            yield this.handleTagSelection(allReceipts);
            this.globalObserver(allReceipts);
        });
    }
}
const app = new App();
app.init();
class Recette {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._servings = data.servings;
        this.ingredients = data.ingredients;
        this._time = data.time;
        this._description = data.description;
        this._appliance = data.appliance;
        this._ustensiles = data.ustensiles;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get servings() {
        return this._servings;
    }
    /**
     *
     * @return {Object}
     */
    get getIngredients() {
        const mappedData = [];
        this.ingredients.map(data => {
            if (!data.quantity)
                mappedData.push({ ingredient: data.ingredient, quantityUnit: null });
            else {
                let quantityUnit = !data.unit
                    ? `${data.quantity}`
                    : `${data.quantity}${this.unitAdapter(data.unit)}`;
                mappedData.push({ ingredient: data.ingredient, quantityUnit });
            }
        });
        return mappedData;
    }
    unitAdapter(unit) {
        if (!unit)
            return "";
        if (unit === "grammes")
            return "g";
        if (unit === "cuillères à soupe")
            return "cs.";
        if (unit === "cuillères à café")
            return "cc.";
        if (unit.length > 3)
            return ` ${unit}`;
        return unit;
    }
    get time() {
        return `${this._time} min`;
    }
    get description() {
        return this._description;
    }
    get appliance() {
        return this._appliance;
    }
    get ustensiles() {
        return this._ustensiles;
    }
}
class DomFactory {
    static renderTagsFilter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const advancedFilter = new SecondFilterTemplate(data);
            return advancedFilter.render();
        });
    }
    static renderRecettesCards(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data.forEach(d => {
                const cardTemplate = new CardTemplate(d);
                const $card = cardTemplate.render();
                const container = document.querySelector(".container");
                return container.appendChild($card);
            });
        });
    }
    static removeRecettesCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.querySelector(".container");
            return (container.innerHTML = "");
        });
    }
    static removeTagsFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...document.querySelectorAll(".filtres__filtre ul")].forEach(filter => (filter.innerHTML = ""));
        });
    }
    static resetDom() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DomFactory.removeRecettesCards();
            yield DomFactory.removeTagsFilter();
        });
    }
    static renderDOM(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DomFactory.renderTagsFilter(data);
            yield DomFactory.renderRecettesCards(data);
        });
    }
}
class SecondFilterTemplate {
    constructor(data) {
        this.data = data;
    }
    getAllIngredients() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            // todo check filter debugger
            this.data.forEach(({ getIngredients }) => getIngredients.forEach(({ ingredient }) => arr.push(StringUtility.capitalize(ingredient))));
            return [...new Set(arr)];
        });
    }
    getAllAppliance() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            this.data.forEach(d => {
                arr.push(d.appliance);
            });
            return [...new Set(arr)];
        });
    }
    getAllUstensiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = [];
            this.data.forEach(d => {
                d === null || d === void 0 ? void 0 : d.ustensiles.forEach(ustensile => {
                    arr.push(StringUtility.capitalize(ustensile));
                });
            });
            return [...new Set(arr)];
        });
    }
    renderItems(filtres) {
        return __awaiter(this, void 0, void 0, function* () {
            const $categories = [...document.querySelectorAll(".filtres__list")];
            return $categories.forEach($category => {
                var _a;
                // @ts-ignore
                const categoryType = (_a = $category === null || $category === void 0 ? void 0 : $category.dataset) === null || _a === void 0 ? void 0 : _a.filterName;
                // @ts-ignore
                const activeCategory = filtres === null || filtres === void 0 ? void 0 : filtres[categoryType];
                activeCategory.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    li.dataset.active = "false";
                    li.dataset.filterType = $category.dataset.filterName;
                    $category.appendChild(li);
                });
            });
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const ingredients = yield this.getAllIngredients();
            const appliance = yield this.getAllAppliance();
            const ustensiles = yield this.getAllUstensiles();
            return yield this.renderItems({ ingredients, appliance, ustensiles });
        });
    }
}
class StringUtility {
    /**
     * Capitalize first Letter of word
     * @param word {string}
     * @return {string}
     */
    static capitalize(word) {
        // words to array
        const words = word.toLowerCase().split(" ");
        // get first word
        const firstWord = words.splice(0, 1);
        // split letters of first word into an array
        const letters = firstWord[0].split("");
        // get the first letter of the first word
        const firstLetter = letters.splice(0, 1);
        // join the letters of the first word with first letter capitalized
        const joinFirstWord = [firstLetter[0].toUpperCase(), ...letters].join("");
        // join all words
        return [joinFirstWord, ...words].join(" ");
    }
}
class CardTemplate {
    constructor(data) {
        this.data = data;
    }
    generateCard(...children) {
        var _a;
        const $children = [...children];
        const $card = document.createElement("div");
        $card.classList.value = "recette";
        $card.setAttribute("data-id", (_a = this.data) === null || _a === void 0 ? void 0 : _a.id.toString());
        $children.forEach(child => $card.appendChild(child));
        return $card;
    }
    generateBody(...children) {
        const $children = [...children];
        const $body = document.createElement("section");
        $body.classList.value = "recette__body";
        $children.forEach(child => $body.appendChild(child));
        return $body;
    }
    generateHeader() {
        return document.createElement("header");
    }
    generateTitle() {
        var _a, _b;
        const timeIcon = document.createElement("span");
        timeIcon.classList.value = "fa-regular fa-clock";
        const time = document.createElement("p");
        time["textContent"] = (_a = this.data) === null || _a === void 0 ? void 0 : _a.time;
        time.prepend(timeIcon);
        const title = document.createElement("h3");
        title.textContent = (_b = this.data) === null || _b === void 0 ? void 0 : _b.name;
        const sectionTitle = document.createElement("section");
        sectionTitle.classList.value = "recette__title";
        sectionTitle.appendChild(title);
        sectionTitle.appendChild(time);
        return sectionTitle;
    }
    generateInformations() {
        var _a;
        const description = document.createElement("p");
        description.classList.value = "recette__description";
        description.textContent = (_a = this.data) === null || _a === void 0 ? void 0 : _a.description;
        const ingredients = document.createElement("ul");
        ingredients.classList.value = "recette__ingredients";
        this.data.getIngredients.forEach(i => {
            const ingredient = document.createElement("li");
            const key = document.createElement("span");
            key.classList.value = "key";
            key.textContent = `${i.ingredient}`;
            ingredient.appendChild(key);
            if (i === null || i === void 0 ? void 0 : i.quantityUnit) {
                const value = document.createElement("span");
                value.classList.value = "value";
                value.textContent = ` : ${i.quantityUnit}`;
                ingredient.appendChild(value);
            }
            ingredients.appendChild(ingredient);
        });
        const sectionInformation = document.createElement("section");
        sectionInformation.classList.value = "recette__informations";
        sectionInformation.appendChild(ingredients);
        sectionInformation.appendChild(description);
        return sectionInformation;
    }
    render() {
        const $header = this.generateHeader();
        const $informationsSection = this.generateInformations();
        const $titleSection = this.generateTitle();
        const $body = this.generateBody($titleSection, $informationsSection);
        return this.generateCard($header, $body);
    }
}
class TagsTemplate {
    constructor(tag) {
        this.tag = tag;
        this.$tagsContainer = document.querySelector("#tagsWrapper");
    }
    createTag() {
        const { textContent: value, dataset } = this.tag;
        const $icon = document.createElement("span");
        $icon.classList.value = "fa-regular fa-circle-xmark icon";
        $icon.ariaHidden = "true";
        const $btn = document.createElement("button");
        $btn.classList.value = "tag__btn";
        $btn.appendChild($icon);
        const $p = document.createElement("p");
        $p.classList.value = "tag__text";
        const $tag = document.createElement("li");
        $tag.classList.value = "tag";
        $tag.dataset.tag = dataset.filterType;
        $tag.textContent = value;
        $tag.appendChild($p);
        $tag.appendChild($btn);
        return $tag;
    }
    appendTag() {
        if (this.$tagsContainer.childNodes.length < 3) {
            const $tag = this.createTag();
            this.$tagsContainer.appendChild($tag);
            this.tag.dataset.active = "true";
            this.tag.setAttribute("disabled", "true");
            const $button = $tag.querySelector(".tag__btn");
            $button.addEventListener("click", () => {
                this.tag.dataset.active = "false";
                this.tag.setAttribute("disabled", "false");
                this.$tagsContainer.removeChild($tag);
            });
            return $tag;
        }
    }
}
class TagObserver {
    constructor(data, filterWrapper) {
        this.data = data;
        this.filterWrapper = filterWrapper;
        this.observers = [];
        this.tags = [];
    }
    subscribe(obs) {
        this.observers.push(obs);
    }
    unsubscribe(obs) {
        const index = this.observers.indexOf(obs);
        this.observers.slice(index, 1);
        const input = obs.querySelector("input");
        input.value = "";
        document.removeEventListener("input", this.updateListOfTags);
    }
    updateListOfTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tagListWrapper = this.filterWrapper.querySelector("ul");
            const { filterName } = tagListWrapper.dataset;
            const { value } = this.filterWrapper.querySelector("input");
            if (filterName)
                this.tags = yield FilterV1.handleTagFiltered(value, filterName);
        });
    }
    selectTags() {
        this.tags.forEach($tag => {
            $tag.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (!$tag.getAttribute("disabled")) {
                    const tagTpl = new TagsTemplate($tag);
                    tagTpl.appendTag();
                    const directParent = $tag.parentNode;
                    const grandParent = directParent.parentNode;
                    const inputElement = grandParent.querySelector("input");
                    inputElement.value = "";
                    yield this.updateListOfTags();
                }
            }));
        });
    }
    fire() {
        this.observers.forEach(obs => {
            this.tags = [...obs.querySelectorAll("li:not([data-hidden=true])")];
            const input = obs.querySelector("input");
            input.addEventListener("input", () => __awaiter(this, void 0, void 0, function* () {
                yield this.updateListOfTags();
            }));
            this.selectTags();
        });
    }
}
class MenuSwitcher {
    constructor(btn, filters, data) {
        this.btn = btn;
        this.allFilters = filters;
        this.parent = this.btn.parentNode;
        this.data = data;
    }
    buttonSwitchState() {
        const tags = new TagObserver(this.data, this.parent);
        this.allFilters.forEach(f => {
            if (f === this.parent) {
                f.dataset.open = "true";
                tags.subscribe(f);
            }
            else {
                f.dataset.open = "false";
                tags.unsubscribe(f);
            }
        });
        tags.fire();
    }
    update() {
        this.buttonSwitchState();
    }
}
class FilterV1 {
    static handleTagFiltered(input, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const pattern = new RegExp(input, "gi");
            const selection = `ul[data-filter-name=${CSS.escape(type)}] li`;
            const $tags = [...document.querySelectorAll(selection)];
            if (input.length === 0)
                $tags.forEach(tag => (tag.dataset.hidden = "false"));
            else
                $tags.forEach((tag) => {
                    var _a;
                    const value = (_a = tag === null || tag === void 0 ? void 0 : tag.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                    if (value && pattern.test(value))
                        tag.dataset.hidden = "false";
                    else
                        tag.dataset.hidden = "true";
                });
            return [...document.querySelectorAll(selection + "[data-hidden=false]")];
        });
    }
}
//# sourceMappingURL=script.js.map