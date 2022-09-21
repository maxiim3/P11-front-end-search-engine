
export class Api {
  /**
   * @type string
   * @private
   */
  #url

  /**
   * @param url : string Url of data
   */
  constructor(url) {
    this.#url = url
  }

  /**
   * @return {Promise<JSON[]>}
   */
  async fetchData() {
    const promise = await fetch(this.#url)
    return await promise.json()
  }
}