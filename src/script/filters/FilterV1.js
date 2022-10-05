var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class FilterV1 {
    constructor(data, { input, }) {
        this.recettes = data;
        this.input = input;
        this.filteredByTags = [];
    }
    filterByTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.filteredByTags;
        });
    }
}
//# sourceMappingURL=FilterV1.js.map