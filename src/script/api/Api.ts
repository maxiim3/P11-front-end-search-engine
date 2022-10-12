import {RecetteFromJSON} from "../models/Recette.js"

export class Api {
	/**
	 * @classdesc fetch api from url
	 * @type string
	 * @private
	 */
	private readonly _url: string

	/**
	 * @param url : string Url of json
	 */
	constructor(url: string) {
		this._url = url
	}

	/**
	 * @description fetch api
	 * @return {Promise<RecetteFromJSON[]>}
	 */
	async fetchData(): Promise<RecetteFromJSON[]> {
		return await fetch(this._url).then(resp => {
			if (resp.ok) {
				return resp.json()
			} else throw new Error("Error during data fetch")
		})
	}
}
