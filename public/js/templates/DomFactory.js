var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SecondFilterTemplate } from "./SecondFilterTemplate";
import { CardTemplate } from "./CardTemplate";
export class DomFactory {
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
//# sourceMappingURL=DomFactory.js.map