var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Api } from "../service/Api";
import { DomFactory } from "../templates/DomFactory";
import { MenuSwitcher } from "../filters/SecondFilter/MenuSwitcher";
import { Recette } from "../models/Recette";
export class App {
    constructor(url) {
        this.keyWords = {
            input: "",
            tags: [],
        };
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
        console.log(this);
        this.url = url;
        this.api = new Api(this.url);
        this.initialData = [];
        console.log(this);
    }
    mapData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data.map(d => new Recette(d));
        });
    }
    removeTags() {
        const $allTags = [...document.querySelectorAll(".filtres__list li")];
        const $tagsContainer = document.querySelector("#tagsWrapper");
        const $selectedTags = [...$tagsContainer.querySelectorAll(".tag")];
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
    globalObserver(allData) {
        const config = {
            attributes: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true,
        };
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
            /*let firstFilterOutput: Recette[] = []
             const {input, tags} = this.keyWords
             const regExp = new RegExp(input, "gi")

             allData.forEach((card:Recette) => {
             if (regExp.test(card.name) || regExp.test(card.description)) return firstFilterOutput.push(card)
             else {
             card.getIngredients.forEach(({ingredient, quantityUnit}: MappedIngredients) => {
             if (regExp.test(ingredient)) return firstFilterOutput.push(card)
             })
             }
             })

             if (!!tags.length) {
             for (const tag of tags) {
             const data = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : firstFilterOutput

             this.dataFilteredByTags = await FilterV1.advancedFilter(data, tag)
             }
             }
             const outputData = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : firstFilterOutput
             console.log(outputData)
             await DomFactory.resetDom()
             return await DomFactory.renderDOM(outputData)*/
            const { input, tags } = this.keyWords;
            const regExp = new RegExp(input, "gi");
            allData
                .filter((card) => regExp.test(card.name) || (regExp.test(card.description) && card))
                .filter((card) => card.getIngredients.forEach(({ ingredient }) => regExp.test(ingredient) && card))
                .some((card) => {
                if (!!tags.length) {
                    for (let { textContent, dataset } of tags) {
                        console.log(textContent, dataset, card);
                    }
                }
            });
            /*await DomFactory.resetDom()
             return await DomFactory.renderDOM(outputData)*/
        });
        observerSearchBar();
        observerTagContainer();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initialData = yield this.api.fetch();
            const allReceipts = yield this.mapData(this.initialData);
            yield DomFactory.renderDOM(allReceipts);
            yield this.handleTagSelection(allReceipts);
            this.globalObserver(allReceipts);
        });
    }
}
const app = new App("data/recipes.json");
app.init().catch(e => new Error("Error on loading page" + e));
//# sourceMappingURL=app.js.map