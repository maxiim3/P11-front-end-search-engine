export class Recette {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._servings = data.servings;
        this.ingredients = data.ingredients;
        this._time = data.time;
        this._description = data.description;
        this._appliance = data.appliance;
        this._ustensiles = data.ustensiles;
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
    get getIngredients() {
        const mappedData = [];
        this.ingredients.map(data => {
            if (!data.quantity)
                mappedData.push({ ingredient: data.ingredient, quantityUnit: null });
            else {
                let quantityUnit = !data.unit
                    ? `${data.quantity}`
                    : `${data.quantity}${this.unitAdapter(data.unit)}`;
                mappedData.push({ ingredient: data.ingredient, quantityUnit });
            }
        });
        return mappedData;
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
//# sourceMappingURL=Recette.js.map