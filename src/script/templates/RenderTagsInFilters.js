var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Utility } from "../utils/Utility.js";
export class RenderTagsInFilters {
    constructor(data) {
        this.recettes = data;
    }
    getAllIngredients() {
        return __awaiter(this, void 0, void 0, function* () {
            const allIngredients = [];
            this.recettes.map(recette => {
                recette.ingredients.forEach(({ ingredient }) => {
                    const ingredientFormatted = Utility.firstLetterToUpperCase(ingredient);
                    allIngredients.push(ingredientFormatted);
                });
            });
            return [...new Set(allIngredients)];
        });
    }
    getAllAppliance() {
        return __awaiter(this, void 0, void 0, function* () {
            const allAppliance = [];
            this.recettes.forEach(({ appliance }) => {
                const applianceFormatted = Utility.firstLetterToUpperCase(appliance);
                allAppliance.push(applianceFormatted);
            });
            return [...new Set(allAppliance)];
        });
    }
    getAllUstensiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUstensiles = [];
            this.recettes.forEach(recette => {
                recette.ustensiles.forEach(ustensile => {
                    const ustensileFormatted = Utility.firstLetterToUpperCase(ustensile);
                    allUstensiles.push(ustensileFormatted);
                });
            });
            return [...new Set(allUstensiles)];
        });
    }
    renderItems(arrayOfTags) {
        return __awaiter(this, void 0, void 0, function* () {
            const $categories = [...document.querySelectorAll(".filtres__list")];
            $categories.forEach($category => {
                const categoryName = $category.dataset.filterName;
                const tags = [...arrayOfTags[categoryName]];
                tags.forEach(tag => {
                    const li = document.createElement("li");
                    const btn = document.createElement("button");
                    btn.textContent = tag;
                    btn.value = tag;
                    btn.dataset.filterType = categoryName;
                    li.appendChild(btn);
                    $category.appendChild(li);
                });
            });
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.recettes.length !== 0) {
                const ingredients = (yield this.getAllIngredients());
                const appliance = (yield this.getAllAppliance());
                const ustensiles = (yield this.getAllUstensiles());
                yield this.renderItems({ ingredients, appliance, ustensiles });
            }
        });
    }
}
//# sourceMappingURL=RenderTagsInFilters.js.map