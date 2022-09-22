
export class Api {
  /**
   * @type string
   * @private
   */
  private readonly _url: string

  /**
   * @param url : string Url of json
   */
  constructor(url : string) {
    this._url = url
  }

  /**
   * @return {Promise<RecetteFromJSON[]>}
   */
  async fetchData() {
    const promise = await fetch(this._url)
    return await promise.json()
  }
}

