"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtility = void 0;
class StringUtility {
    /**
     * Capitalize first Letter of word
     * @param word {string}
     * @return {string}
     */
    static capitalize(word) {
        // words to array
        const words = word.toLowerCase().split(" ");
        // get first word
        const firstWord = words.splice(0, 1);
        // split letters of first word into an array
        const letters = firstWord[0].split("");
        // get the first letter of the first word
        const firstLetter = letters.splice(0, 1);
        // join the letters of the first word with first letter capitalized
        const joinFirstWord = [firstLetter[0].toUpperCase(), ...letters].join("");
        // join all words
        return [joinFirstWord, ...words].join(" ");
    }
}
exports.StringUtility = StringUtility;
//# sourceMappingURL=StringUtility.js.map