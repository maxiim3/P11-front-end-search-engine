var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Recette } from "./models/Recette.js";
import { DomObserver } from "./views/DomObserver.js";
import { CardTemplate } from "./views/CardTemplate.js";
import { HandleOptionTags } from "./views/HandleOptionTags.js";
import { ContextState } from "./context/ContextState.js";
export class App {
    constructor() {
        this._fetchedData = [];
        this._allReceipts = [];
    }
    handleDataFromJson() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch("https://project.maxime-tamburrini.com/oc_projet_7/api/recipes.json")
                .then(resp => {
                console.log(resp.json());
                return resp.json();
            })
                .then(data => {
                console.log(data);
                this._fetchedData = [...data];
                console.log(this._fetchedData);
                this._allReceipts = this._fetchedData.map(data => new Recette(data));
                console.log(this._allReceipts);
                return this._allReceipts;
            })
                .catch(reason => {
                throw new Error(reason);
            });
            console.log("i'm done");
            return this._allReceipts;
        });
    }
    hydrateCardContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            const container = document.querySelector(".container");
            return this._allReceipts.forEach(d => {
                const cardTemplate = new CardTemplate(d);
                const $card = cardTemplate.render();
                container.appendChild($card);
            });
        });
    }
    hydrateFilterContainers() {
        return __awaiter(this, void 0, void 0, function* () {
            const advancedFilter = new HandleOptionTags(this._allReceipts);
            return advancedFilter.render();
        });
    }
    handleMenuContext() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("im here");
            const filters = [...document.querySelectorAll(".filtres__filtre")];
            const contextObservers = [];
            filters.forEach(filter => contextObservers.push(new ContextState(filter)));
            contextObservers.forEach(obs => {
                const button = obs.filter.querySelector(".filtres__button");
                button.addEventListener("click", onClickOnFilter);
            });
            function onClickOnFilter() {
                const clickedObserver = contextObservers.filter(({ filter }) => {
                    return filter.querySelector(".filtres__button") === this;
                })[0];
                contextObservers.forEach(observer => {
                    if (observer === clickedObserver) {
                        observer.setState("open");
                    }
                    else {
                        observer.setState("close");
                    }
                });
            }
        });
    }
    handleDOMChange() {
        return __awaiter(this, void 0, void 0, function* () {
            const domChange = new DomObserver(this._allReceipts);
            yield domChange.observeDomChange();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.handleDataFromJson().then(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.hydrateCardContainer();
                    yield this.hydrateFilterContainers();
                    yield this.handleDOMChange();
                    yield this.handleMenuContext();
                }));
            }
            catch (e) {
                console.warn(`404: ${e}`);
            }
        });
    }
}
//# sourceMappingURL=App.js.map