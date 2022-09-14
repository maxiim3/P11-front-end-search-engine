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
    /*
     private keyWords = {
     input: "",
     tags: [],
     }
     */
    constructor() { }
    mapData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("data");
            return data.map((d) => new Recette(d));
        });
    }
    /*handleTagSelection = async (data: Recette[]) => {
     const buttons = [...document.querySelectorAll(".filtres__button")] as HTMLButtonElement[]
     const filters = [...document.querySelectorAll(".filtres__filtre")] as HTMLLIElement[]

     buttons.forEach(btn => {
     const switcher = new MenuSwitcher(btn, filters, data)

     btn.addEventListener("click", e => {
     e.preventDefault()
     switcher.update()
     })
     })
     }*/
    /*removeTags() {
     const $allTags = [...document.querySelectorAll(".filtres__list li")] as HTMLLIElement[]
     const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
     const $selectedTags = [...$tagsContainer.querySelectorAll(".tag")] as HTMLDivElement[]

     $selectedTags.forEach((tag: HTMLDivElement) => {
     if (tag) {
     $allTags.filter(li => {
     if (li.textContent === tag.textContent) {
     li.dataset.active = "false"
     li.dataset.hidden = "false"
     li.setAttribute("disabled", "false")
     $tagsContainer.removeChild(li)
     }
     })
     }
     })
     }*/
    /*globalObserver(allData: Recette[]) {
     const config = {
     attributes: true,
     characterDataOldValue: true,
     childList: true,
     subtree: true,
     }
     const observerSearchBar = () => {
     const $mainSearchBar = document.querySelector("#searchBar") as HTMLInputElement
     $mainSearchBar.addEventListener("input", async () => {
     this.removeTags()
     this.keyWords.input = $mainSearchBar.value
     await FilterKeyWords()
     })
     }

     const observerTagContainer = () => {
     const $tagsContainer = document.querySelector("#tagsWrapper") as HTMLDivElement
     const observer = new MutationObserver(async mutationRecords => {
     const tags: HTMLLIElement[] = [...mutationRecords[0].target.childNodes] as HTMLLIElement[]
     this.keyWords.tags = []
     console.log(typeof tags)
     // tags.forEach(tag => this.keyWords.tags.push(tag))
     await FilterKeyWords()
     })
     observer.observe($tagsContainer, config)
     }

     const FilterKeyWords = async () => {
     const {input, tags} = this.keyWords
     const regExp = new RegExp(input, "gi")

     allData
     .filter((card: Recette) => regExp.test(card.name) || (regExp.test(card.description) && card))
     .filter((card: Recette) =>
     card.getIngredients.forEach(({ingredient}: MappedIngredients) => regExp.test(ingredient) && card)
     )
     .some((card: Recette) => {
     if (!!tags.length) {
     for (let {textContent, dataset} of tags) {
     console.log(textContent, dataset, card)
     }
     }
     })

     /!*await DomFactory.resetDom()
     return await DomFactory.renderDOM(outputData)*!/
     }
     observerSearchBar()
     observerTagContainer()
     }*/
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const initialData = yield fetchData("/src/data/recipes.json");
            const allReceipts = yield this.mapData(initialData);
            // await DomFactory.renderDOM(allReceipts)
            console.log(allReceipts);
            // await this.handleTagSelection(allReceipts)
            // this.globalObserver(allReceipts)
        });
    }
}
console.log("coucou");
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
//# sourceMappingURL=script.js.map