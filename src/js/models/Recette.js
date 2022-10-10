
export class Recette {
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._ingredients = this.getIngredients(data.ingredients);
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
    get ingredients() {
        return this._ingredients;
    }
    /**
     * ### getIngredients
     * @description transforms {ingredient, quantity, unit} into {ingredient, quantityUnit}
     * @return Object[]
     */
    getIngredients(ingredients) {
        let output = [];
        let quantityUnitOutput;
        ingredients.map(({ ingredient, quantity, unit }) => {
            const ingredientOutput = ingredient;
            if (quantity === undefined || unit === undefined)
                quantityUnitOutput = null;
            else {
                let switchUnit = this._unitAdapter(unit);
                quantityUnitOutput = `${quantity}${switchUnit}`;
            }
            output.push({ ingredient: ingredientOutput, quantityUnit: quantityUnitOutput });
        });
        return output;
    }

    /**
     * Unit
     * @description returns formatted unit
     * @param unit : string
     * @return string | undefined | null): string | undefined | null
     */
    _unitAdapter(unit) {
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
}
