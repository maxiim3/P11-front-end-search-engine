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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomFactory = void 0;
const Recette_1 = require("../models/Recette");
const SecondFilterTemplate_1 = require("./SecondFilterTemplate");
const CardTemplate_1 = require("./CardTemplate");
class DomFactory {
    static mapData(data) {
        return data.map(d => new Recette_1.Recette(d));
    }
    static renderTagsFilter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const advancedFilter = new SecondFilterTemplate_1.SecondFilterTemplate(data);
            return advancedFilter.render();
        });
    }
    static renderRecettesCards(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data.forEach(d => {
                const cardTemplate = new CardTemplate_1.CardTemplate(d);
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
            const mapData = DomFactory.mapData(data);
            yield DomFactory.renderTagsFilter(mapData);
            yield DomFactory.renderRecettesCards(mapData);
        });
    }
}
exports.DomFactory = DomFactory;
//# sourceMappingURL=DomFactory.js.map