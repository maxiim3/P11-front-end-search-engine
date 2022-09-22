var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CardTemplate_instances, _CardTemplate_generateCard;
export class CardTemplate {
    constructor(data) {
        _CardTemplate_instances.add(this);
        this.recette = data;
    }
    generateTitle() {
        const timeIcon = document.createElement("span");
        timeIcon.classList.value = "fa-regular fa-clock";
        const time = document.createElement("p");
        time.textContent = this.recette.time;
        time.prepend(timeIcon);
        const title = document.createElement("h3");
        title.textContent = this.recette.name;
        const sectionTitle = document.createElement("section");
        sectionTitle.classList.value = "recette__title";
        sectionTitle.appendChild(title);
        sectionTitle.appendChild(time);
        return sectionTitle;
    }
    generateInformations() {
        const description = document.createElement("p");
        description.classList.value = "recette__description";
        description.textContent = this.recette.description;
        const ingredients = document.createElement("ul");
        ingredients.classList.value = "recette__ingredients";
        this.recette.ingredients.map(i => {
            const ingredient = document.createElement("li");
            const key = document.createElement("span");
            key.classList.value = "key";
            key.textContent = `${i.ingredient}`;
            ingredient.appendChild(key);
            if (i.quantityUnit) {
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
    render() {
        const $informationsSection = this.generateInformations();
        const $titleSection = this.generateTitle();
        const $header = this.generateHeader();
        const $body = this.generateBody($titleSection, $informationsSection);
        return __classPrivateFieldGet(this, _CardTemplate_instances, "m", _CardTemplate_generateCard).call(this, $header, $body);
    }
}
_CardTemplate_instances = new WeakSet(), _CardTemplate_generateCard = function _CardTemplate_generateCard(...children) {
    const $children = [...children];
    const $card = document.createElement("div");
    $card.classList.value = "recette";
    $card.dataset.id = this.recette.id.toString();
    $children.forEach(child => $card.appendChild(child));
    return $card;
};
//# sourceMappingURL=CardTemplate.js.map