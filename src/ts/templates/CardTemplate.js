"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.CardTemplate = void 0;
var CardTemplate = /** @class */ (function () {
    function CardTemplate(data) {
        this.data = data;
    }
    CardTemplate.prototype.generateCard = function () {
        var _a, _b;
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        var $children = __spreadArray([], children, true);
        var $card = document.createElement("div");
        $card.classList.value = "recette";
        (_a = $card === null || $card === void 0 ? void 0 : $card.dataset) === null || _a === void 0 ? void 0 : _a.id = (_b = this.data) === null || _b === void 0 ? void 0 : _b.id;
        $children.forEach(function (child) { return $card.appendChild(child); });
        return $card;
    };
    CardTemplate.prototype.generateBody = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        var $children = __spreadArray([], children, true);
        var $body = document.createElement("section");
        $body.classList.value = "recette__body";
        $children.forEach(function (child) { return $body.appendChild(child); });
        return $body;
    };
    CardTemplate.prototype.generateHeader = function () {
        return document.createElement("header");
    };
    CardTemplate.prototype.generateTitle = function () {
        var _a, _b;
        var timeIcon = document.createElement("span");
        timeIcon.classList.value = "fa-regular fa-clock";
        var time = document.createElement("p");
        time["textContent"] = (_a = this.data) === null || _a === void 0 ? void 0 : _a.time;
        time.prepend(timeIcon);
        var title = document.createElement("h3");
        title.textContent = (_b = this.data) === null || _b === void 0 ? void 0 : _b.name;
        var sectionTitle = document.createElement("section");
        sectionTitle.classList.value = "recette__title";
        sectionTitle.appendChild(title);
        sectionTitle.appendChild(time);
        return sectionTitle;
    };
    CardTemplate.prototype.generateInformations = function () {
        var _a, _b, _c;
        var description = document.createElement("p");
        description.classList.value = "recette__description";
        description.textContent = (_a = this.data) === null || _a === void 0 ? void 0 : _a.description;
        var ingredients = document.createElement("ul");
        ingredients.classList.value = "recette__ingredients";
        (_c = (_b = this.data) === null || _b === void 0 ? void 0 : _b.ingredients) === null || _c === void 0 ? void 0 : _c.forEach(function (i) {
            var ingredient = document.createElement("li");
            var key = document.createElement("span");
            key.classList.value = "key";
            key.textContent = "".concat(i.ingredient);
            ingredient.appendChild(key);
            if (i.quantityUnit) {
                var value = document.createElement("span");
                value.classList.value = "value";
                value.textContent = " : ".concat(i.quantityUnit);
                ingredient.appendChild(value);
            }
            ingredients.appendChild(ingredient);
        });
        var sectionInformation = document.createElement("section");
        sectionInformation.classList.value = "recette__informations";
        sectionInformation.appendChild(ingredients);
        sectionInformation.appendChild(description);
        return sectionInformation;
    };
    CardTemplate.prototype.render = function () {
        var $header = this.generateHeader();
        var $informationsSection = this.generateInformations();
        var $titleSection = this.generateTitle();
        var $body = this.generateBody($titleSection, $informationsSection);
        return this.generateCard($header, $body);
    };
    return CardTemplate;
}());
exports.CardTemplate = CardTemplate;
