var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class FilterV1 {
    /*
    static async mainFilter(data: Object[], input: string) {
        let output: [] = []
        const pattern = new RegExp(input, "gi")

        data.forEach((card: Object) => {
            if (pattern.test(card.name) || pattern.test(card.description)) return output.push(card)
            else {
                card.ingredients.forEach(ingredient => {
                    if (pattern.test(ingredient.ingredient)) return output.push(card)
                })
            }
        })
        return output
    }

    static async advancedFilter(data: Recette[], {textContent, dataset}: HTMLLIElement) {
        const {tag: type} = dataset
        let output: [] = []
        const pattern = new RegExp(textContent, "gi")
        console.log(textContent)
        data.forEach((card: Recette) =>
            switch (type) {
                case "ingredients":
                    card.ingredients.forEach(ingredient => {
                        if (pattern.test(ingredient.ingredient)) return output.push(card)
                    })
                    break
                case "appliance":
                    if (pattern.test(card.appliance)) return output.push(card)

                    break
                case "ustensiles":
                    card.ustensiles.forEach(ustensile => {
                        if (pattern.test(ustensile)) return output.push(card)
                    })
                    break
            }
        )
        return output
    }
 */
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
//# sourceMappingURL=FilterV1.js.map