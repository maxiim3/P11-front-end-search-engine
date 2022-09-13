"use strict";
exports.__esModule = true;
exports.Recette = void 0;
var Recette = /** @class */ (function () {
    function Recette(_a) {
        var id = _a.id, name = _a.name, servings = _a.servings, ingredients = _a.ingredients, time = _a.time, description = _a.description, appliance = _a.appliance, ustensiles = _a.ustensiles;
        this._id = id;
        this._name = name;
        this._servings = servings;
        this._ingredients = ingredients;
        this._time = time;
        this._description = description;
        this._appliance = appliance;
        this._ustensiles = ustensiles;
    }
    Object.defineProperty(Recette.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recette.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recette.prototype, "servings", {
        get: function () {
            return this._servings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recette.prototype, "ingredients", {
        /**
         *
         * @return {Object}
         */
        get: function () {
            var _this = this;
            return this._ingredients.map(function (_a) {
                var ingredient = _a.ingredient, quantity = _a.quantity, unit = _a.unit;
                if (!quantity)
                    return { ingredient: ingredient };
                else {
                    var switchUnit = _this.unitAdapter(unit);
                    var quantityUnit = "".concat(quantity).concat(switchUnit);
                    return { ingredient: ingredient, quantityUnit: quantityUnit };
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    Recette.prototype.unitAdapter = function (unit) {
        if (!unit)
            return "";
        if (unit === "grammes")
            return "g";
        if (unit === "cuillères à soupe")
            return "cs.";
        if (unit === "cuillères à café")
            return "cc.";
        if (unit.length > 3)
            return " ".concat(unit);
        return unit;
    };
    Object.defineProperty(Recette.prototype, "time", {
        get: function () {
            return "".concat(this._time, " min");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recette.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recette.prototype, "appliance", {
        get: function () {
            return this._appliance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Recette.prototype, "ustensiles", {
        get: function () {
            return this._ustensiles;
        },
        enumerable: false,
        configurable: true
    });
    return Recette;
}());
exports.Recette = Recette;
