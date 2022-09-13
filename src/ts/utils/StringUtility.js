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
exports.StringUtility = void 0;
var StringUtility = /** @class */ (function () {
    function StringUtility() {
    }
    /**
     * Capitalize first Letter of word
     * @param word {string}
     * @return {string}
     */
    StringUtility.capitalize = function (word) {
        // words to array
        var words = word.toLowerCase().split(" ");
        // get first word
        var firstWord = words.splice(0, 1);
        // split letters of first word into an array
        var letters = firstWord[0].split("");
        // get the first letter of the first word
        var firstLetter = letters.splice(0, 1);
        // join the letters of the first word with first letter capitalized
        var joinFirstWord = __spreadArray([firstLetter[0].toUpperCase()], letters, true).join("");
        // join all words
        return __spreadArray([joinFirstWord], words, true).join(" ");
    };
    return StringUtility;
}());
exports.StringUtility = StringUtility;
