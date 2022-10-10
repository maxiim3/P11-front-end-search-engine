
export class Api {
    /**
     * @classdesc fetch data from url
     * @type string
     */
     _url

    /**
     * @param url : string Url of json
     */
    constructor(url ) {
        this._url = url
    }

    /**
     * @description fetch data
     * @return {Promise<Object[]>}
     */
    async fetchData() {
        const promise = await fetch(this._url)
        return await promise.json()
    }
}

