var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RenderTagsInFilters } from "./RenderTagsInFilters.js";
import { CardTemplate } from "./CardTemplate.js";
export class DomFactoryMethods {
    static renderTagsFilter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const advancedFilter = new RenderTagsInFilters(data);
            return advancedFilter.render();
        });
    }
    static renderRecettesCards(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data.forEach(d => {
                const cardTemplate = new CardTemplate(d);
                const $card = cardTemplate.render();
                DomFactoryMethods.container.appendChild($card);
            });
        });
    }
    static removeRecettesCards() {
        return __awaiter(this, void 0, void 0, function* () {
            DomFactoryMethods.container.innerHTML = "";
        });
    }
    static removeTagsFilter() {
        return __awaiter(this, void 0, void 0, function* () {
            return DomFactoryMethods.filters.forEach(filter => (filter.innerHTML = ""));
        });
    }
    static resetDom() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DomFactoryMethods.removeRecettesCards();
            yield DomFactoryMethods.removeTagsFilter();
        });
    }
    static renderDOM(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DomFactoryMethods.renderTagsFilter(data);
            yield DomFactoryMethods.renderRecettesCards(data);
        });
    }
}
DomFactoryMethods.container = document.querySelector(".container");
DomFactoryMethods.filters = [...document.querySelectorAll(".filtres__filtre ul")];
//# sourceMappingURL=DomFactoryMethods.js.map