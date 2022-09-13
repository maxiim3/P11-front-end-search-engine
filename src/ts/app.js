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
var Api_1 = require("./api/Api");
var DomFactory_1 = require("./templates/DomFactory");
var FilterV1_1 = require("./utils/FilterV1");
var MenuSwitcher_1 = require("./filters/SecondFilter/MenuSwitcher");
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.handleTagSelection = function () { return __awaiter(_this, void 0, void 0, function () {
            var buttons, parentNode;
            var _this = this;
            return __generator(this, function (_a) {
                buttons = __spreadArray([], document.querySelectorAll(".filtres__button"), true);
                parentNode = __spreadArray([], document.querySelectorAll(".filtres__filtre"), true);
                buttons.forEach(function (btn) {
                    var switcher = new MenuSwitcher_1.MenuSwitcher(btn, parentNode, _this.initialData);
                    btn.addEventListener("click", function (e) {
                        e.preventDefault();
                        switcher.update();
                    });
                });
                return [2 /*return*/];
            });
        }); };
        this.url = "data/recipes.json";
        this.api = new Api_1.Api(this.url);
        this.initialData = [];
        this.dataFilteredByTags = [];
    }
    App.prototype.removeTags = function () {
        var $allTags = __spreadArray([], document.querySelectorAll(".filtres__list li"), true);
        var $tagsContainer = document.querySelector("#tagsWrapper");
        var $selectedTags = __spreadArray([], $tagsContainer.querySelectorAll(".tag"), true);
        this.dataFilteredByTags = [];
        $selectedTags.forEach(function (tag) {
            if (tag) {
                $allTags.filter(function (li) {
                    if (li.textContent === tag.textContent) {
                        li.dataset.active = "false";
                        li.dataset.hidden = "false";
                        li.setAttribute("disabled", "false");
                        $tagsContainer.removeChild(li);
                    }
                });
            }
        });
    };
    App.prototype.globalObserver = function () {
        var _this = this;
        var config = {
            attributes: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true
        };
        var observerSearchBar = function () {
            var $mainSearchBar = document.querySelector("#searchBar");
            $mainSearchBar.addEventListener("input", function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.removeTags();
                            this.keyWords.input = $mainSearchBar.value;
                            return [4 /*yield*/, FilterKeyWords()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        var observerTagContainer = function () {
            var $tagsContainer = document.querySelector("#tagsWrapper");
            var observer = new MutationObserver(function (mutationRecords, observer) { return __awaiter(_this, void 0, void 0, function () {
                var tags;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tags = __spreadArray([], mutationRecords[0].target.childNodes, true);
                            this.keyWords.tags = [];
                            tags.forEach(function (tag) { return _this.keyWords.tags.push(tag); });
                            return [4 /*yield*/, FilterKeyWords()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            observer.observe($tagsContainer, config);
        };
        var FilterKeyWords = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, input, tags, dataFilteredByMainSearch, _i, tags_1, tag, data, _b, outputData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.keyWords, input = _a.input, tags = _a.tags;
                        return [4 /*yield*/, FilterV1_1.FilterV1.mainFilter(this.initialData, input)];
                    case 1:
                        dataFilteredByMainSearch = _c.sent();
                        if (!(tags.length > 0)) return [3 /*break*/, 5];
                        _i = 0, tags_1 = tags;
                        _c.label = 2;
                    case 2:
                        if (!(_i < tags_1.length)) return [3 /*break*/, 5];
                        tag = tags_1[_i];
                        data = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : dataFilteredByMainSearch;
                        _b = this;
                        return [4 /*yield*/, FilterV1_1.FilterV1.advancedFilter(data, tag)];
                    case 3:
                        _b.dataFilteredByTags = _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        outputData = this.dataFilteredByTags.length > 0 ? this.dataFilteredByTags : dataFilteredByMainSearch;
                        console.log(outputData);
                        return [4 /*yield*/, DomFactory_1.DomFactory.resetDom()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, DomFactory_1.DomFactory.renderDOM(outputData)];
                    case 7: return [2 /*return*/, _c.sent()];
                }
            });
        }); };
        observerSearchBar();
        observerTagContainer();
    };
    App.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.api.fetch()];
                    case 1:
                        _a.initialData = _b.sent();
                        return [4 /*yield*/, DomFactory_1.DomFactory.renderDOM(this.initialData)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.handleTagSelection()];
                    case 3:
                        _b.sent();
                        this.globalObserver();
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
var app = new App();
app.init()["catch"](function (e) { return new Error("Error on loading page" + e); });
