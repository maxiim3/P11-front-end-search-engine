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
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.handleFirstFilter = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var $mainSearchBar, filter;
            var _this = this;
            return __generator(this, function (_a) {
                $mainSearchBar = document.querySelector("#searchBar");
                filter = new MainFilter(data);
                $mainSearchBar.addEventListener("input", function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, tagsInList, activeTagsContainer, activeTags;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this;
                                return [4 /*yield*/, filter.update()];
                            case 1:
                                _a.dataFilteredByMainSearch = _b.sent();
                                tagsInList = __spreadArray([], document.querySelectorAll(".filtres__list li"), true);
                                activeTagsContainer = document.querySelector("#tagsWrapper");
                                activeTags = __spreadArray([], activeTagsContainer.querySelectorAll(".tag"), true);
                                activeTags.forEach(function (tag) {
                                    if (tag) {
                                        var that = tagsInList.find(function (li) { return li.textContent === tag.textContent; });
                                        that.dataset.active = "false";
                                        that.dataset.hidden = "false";
                                        that.disabled = false;
                                        activeTagsContainer.removeChild(tag);
                                    }
                                });
                                return [2 /*return*/, this.dataFilteredByMainSearch];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.handleSecondFilter = function () { return __awaiter(_this, void 0, void 0, function () {
            var parentNode, buttons;
            var _this = this;
            return __generator(this, function (_a) {
                parentNode = __spreadArray([], document.querySelectorAll(".filtres__filtre"), true);
                buttons = __spreadArray([], document.querySelectorAll(".filtres__button"), true);
                buttons.forEach(function (btn) {
                    var switcher = new MenuSwitcher(btn, parentNode, _this.dataFilteredByMainSearch);
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
        this.dataFilteredByMainSearch = [];
        this.dataFilteredByTags = [];
        this.activeTags = [];
    }
    App.prototype.observeTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $tagsContainer, config, observer;
            var _this = this;
            return __generator(this, function (_a) {
                $tagsContainer = document.querySelector("#tagsWrapper");
                config = {
                    attributes: true,
                    characterDataOldValue: true,
                    childList: true,
                    subtree: true
                };
                observer = new MutationObserver(function (mutationRecords, observer) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, _a, tag, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                this.activeTags = __spreadArray([], mutationRecords[0].target.childNodes, true);
                                console.log(this.activeTags);
                                if (!this.activeTags[0]) return [3 /*break*/, 7];
                                _i = 0, _a = this.activeTags;
                                _c.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                tag = _a[_i];
                                _b = this;
                                return [4 /*yield*/, FilterV1.advancedFilter(this.dataFilteredByMainSearch, tag)];
                            case 2:
                                _b.dataFilteredByTags = _c.sent();
                                return [4 /*yield*/, DomFactory_1.DomFactory.resetDom()];
                            case 3:
                                _c.sent();
                                return [4 /*yield*/, DomFactory_1.DomFactory.renderDOM(this.dataFilteredByTags)];
                            case 4:
                                _c.sent();
                                console.log(this.dataFilteredByTags);
                                _c.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 1];
                            case 6: return [3 /*break*/, 10];
                            case 7:
                                console.log("no tag");
                                return [4 /*yield*/, DomFactory_1.DomFactory.resetDom()];
                            case 8:
                                _c.sent();
                                return [4 /*yield*/, DomFactory_1.DomFactory.renderDOM(this.dataFilteredByMainSearch)];
                            case 9:
                                _c.sent();
                                _c.label = 10;
                            case 10:
                                observer.takeRecords();
                                return [2 /*return*/];
                        }
                    });
                }); });
                observer.observe($tagsContainer, config);
                return [2 /*return*/];
            });
        });
    };
    App.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initialFetchedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.fetch()];
                    case 1:
                        initialFetchedData = _a.sent();
                        this.dataFilteredByMainSearch = initialFetchedData;
                        return [4 /*yield*/, DomFactory_1.DomFactory.renderDOM(initialFetchedData)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.handleFirstFilter(initialFetchedData)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.handleSecondFilter()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.observeTags()
                            /* todo render DOm
                                Observe changes on selected Tags
                                If change, rerender Data through filter
                                    - .filter() by search bar, then .some() by tags attributes
                                    - render DOM
                    
                             */
                        ];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
var app = new App();
app.init()["catch"](function (e) { return new Error("Error on loading page" + e); });
