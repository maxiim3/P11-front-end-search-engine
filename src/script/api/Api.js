var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Api {
    constructor(url) {
        this._url = url;
    }
    fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(this._url).then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
                else
                    throw new Error("Error during data fetch");
            });
        });
    }
}
//# sourceMappingURL=Api.js.map