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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.FilterV1 = void 0;
var FilterV1 = /** @class */ (function () {
    function FilterV1() {
    }
    FilterV1.mainFilter = function (data, input) {
        return __awaiter(this, void 0, void 0, function () {
            var output, pattern;
            return __generator(this, function (_a) {
                output = [];
                pattern = new RegExp(input, "gi");
                data.forEach(function (card) {
                    if (pattern.test(card.name) || pattern.test(card.description))
                        return output.push(card);
                    else {
                        card.ingredients.forEach(function (ingredient) {
                            if (pattern.test(ingredient.ingredient))
                                return output.push(card);
                        });
                    }
                });
                return [2 /*return*/, output];
            });
        });
    };
    FilterV1.advancedFilter = function (data, _a) {
        var textContent = _a.textContent, dataset = _a.dataset;
        return __awaiter(this, void 0, void 0, function () {
            var type, output, pattern;
            return __generator(this, function (_b) {
                type = dataset.tag;
                output = [];
                pattern = new RegExp(textContent, "gi");
                console.log(textContent);
                data.forEach(function (card) {
                    switch (type) {
                        case "ingredients":
                            card.ingredients.forEach(function (ingredient) {
                                if (pattern.test(ingredient.ingredient))
                                    return output.push(card);
                            });
                            break;
                        case "appliance":
                            if (pattern.test(card.appliance))
                                return output.push(card);
                            break;
                        case "ustensiles":
                            card.ustensiles.forEach(function (ustensile) {
                                if (pattern.test(ustensile))
                                    return output.push(card);
                            });
                            break;
                    }
                });
                return [2 /*return*/, output];
            });
        });
    };
    FilterV1.handleTagFiltered = function (input, type) {
        return __awaiter(this, void 0, void 0, function () {
            var pattern, selection, $tags;
            return __generator(this, function (_a) {
                pattern = new RegExp(input, "gi");
                selection = "ul[data-filter-name=".concat(CSS.escape(type), "] li");
                $tags = __spreadArray([], document.querySelectorAll(selection), true);
                if (input.length === 0)
                    $tags.forEach(function (tag) { return (tag.dataset.hidden = "false"); });
                else
                    $tags.forEach(function (tag) {
                        var value = tag.textContent.toLowerCase();
                        if (pattern.test(value))
                            tag.dataset.hidden = "false";
                        else
                            tag.dataset.hidden = "true";
                    });
                return [2 /*return*/, __spreadArray([], document.querySelectorAll(selection + "[data-hidden=false]"), true)];
            });
        });
    };
    return FilterV1;
}());
exports.FilterV1 = FilterV1;
