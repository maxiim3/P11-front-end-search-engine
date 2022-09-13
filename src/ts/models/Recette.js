"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recette = void 0;
class Recette {
    constructor({ id, name, servings, ingredients, time, description, appliance, ustensiles, }) {
        this._id = id;
        this._name = name;
        this._servings = servings;
        this._ingredients = ingredients;
        this._time = time;
        this._description = description;
        this._appliance = appliance;
        this._ustensiles = ustensiles;
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
    get ingredients() {
        return this._ingredients.map(({ ingredient, quantity, unit }) => {
            if (!quantity)
                return { ingredient };
            else {
                const switchUnit = this.unitAdapter(unit);
                const quantityUnit = `${quantity}${switchUnit}`;
                return [ingredient, quantityUnit];
            }
        });
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
exports.Recette = Recette;
//# sourceMappingURL=Recette.js.map