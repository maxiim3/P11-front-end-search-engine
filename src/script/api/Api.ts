import {RecetteFromJSON} from "../models/Recette.js"

export class Api {
  /**
   * @classdesc fetch data from url
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
   * @description fetch data
   * @return {Promise<RecetteFromJSON[]>}
   */
  async fetchData():Promise<RecetteFromJSON[]> {
    const promise = await fetch(this._url)
    return await promise.json()
  }
}

