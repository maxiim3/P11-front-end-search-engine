export class StringUtility {
    static firstLetterToUpperCase(word) {
        const words = word.toLowerCase().split(" ");
        const firstWord = words.splice(0, 1);
        const letters = firstWord[0].split("");
        const firstLetter = letters.splice(0, 1);
        const joinFirstWord = [firstLetter[0].toUpperCase(), ...letters].join("");
        return [joinFirstWord, ...words].join(" ");
    }
    static removeAccent(words) {
        const e = ["é", "è", "ê", "ë", "ē", "ė"];
        const a = ["à", "á", "â", "ä"];
        const i = ["î", "ï"];
        const o = ["ô", "ó", "ø"];
        const u = ["û", "ü", "ù", "ú"];
        words = words.toLowerCase();
        const letters = words.split("");
        const out = [];
        letters.map(letter => {
            e.forEach(voy => (letter = letter === voy ? "e" : letter));
            a.forEach(voy => (letter = letter === voy ? "a" : letter));
            i.forEach(voy => (letter = letter === voy ? "i" : letter));
            o.forEach(voy => (letter = letter === voy ? "o" : letter));
            u.forEach(voy => (letter = letter === voy ? "u" : letter));
            letter = letter === "œ" ? "eu" : letter;
            letter = letter === "ç" ? "c" : letter;
            out.push(letter.toLowerCase());
        });
        return out.join("");
    }
}
//# sourceMappingURL=StringUtility.js.map