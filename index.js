//region API
class Api {
  constructor(url) {
    this.url = url;
  }

  async fetch() {
    const promise = await fetch(this.url);
    return await promise.json();
  }
}

//endregion

//region Card Constructor
class CardConstructor {
  constructor(data) {
    this._id = data.id;
    this._name = data.name;
    this._servings = data.servings;
    this._ingredients = data.ingredients;
    this._time = data.time;
    this._description = data.description;
    this._appliance = data.appliance;
    this._ustensiles = data.ustensiles;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get servings() {
    return this._servings;
  }

  /**
   *
   * @return {Object} {ingredient <String>, quantityUnit <String>}
   */
  get ingredients() {
    return this._ingredients.map((list) => {
      let { ingredient, quantity, unit } = list;

      if (!quantity) return { ingredient };

      const switchUnit = this.unitAdapter(unit);
      const quantityUnit = `${quantity}${switchUnit}`;
      return { ingredient, quantityUnit };
    });
  }

  unitAdapter(unit) {
    if (!unit) return "";
    if (unit === "grammes") return "g";
    if (unit === "cuillères à soupe") return "cs.";
    if (unit === "cuillères à café") return "cc.";
    if (unit.length > 3) return ` ${unit}`;
    return unit;
  }

  get time() {
    return `${this._time} min`;
  }

  get description() {
    return this._description;
  }

  get appliance() {
    return this._appliance;
  }

  get ustensiles() {
    return this._ustensiles;
  }
}

//endregion

//region Card Tempalte
class CardTemplate {
  constructor(data) {
    this.data = data;
  }

  generateCard(...children) {
    const $children = [...children];
    const $card = document.createElement("div");
    $card.classList.value = "recette";

    $children.forEach((child) => $card.appendChild(child));

    return $card;
  }

  generateBody(...children) {
    const $children = [...children];
    const $body = document.createElement("section");
    $body.classList.value = "recette__body";
    $children.forEach((child) => $body.appendChild(child));

    return $body;
  }

  generateHeader() {
    return document.createElement("header");
  }

  generateTitle() {
    const timeIcon = document.createElement("span");
    timeIcon.classList.value = "fa-regular fa-clock";

    const time = document.createElement("p");
    time.textContent = this.data.time;
    time.prepend(timeIcon);

    const title = document.createElement("h3");
    title.textContent = this.data.name;

    const sectionTitle = document.createElement("section");
    sectionTitle.classList.value = "recette__title";
    sectionTitle.appendChild(title);
    sectionTitle.appendChild(time);

    return sectionTitle;
  }

  generateInformations() {
    const description = document.createElement("p");
    description.classList.value = "recette__description";
    description.textContent = this.data.description;

    const ingredients = document.createElement("ul");
    ingredients.classList.value = "recette__ingredients";

    this.data.ingredients.forEach((i) => {
      const ingredient = document.createElement("li");

      const key = document.createElement("span");
      key.classList.value = "key";
      key.textContent = `${i.ingredient}`;
      ingredient.appendChild(key);

      if (i.quantityUnit) {
        const value = document.createElement("span");
        value.classList.value = "value";
        value.textContent = ` : ${i.quantityUnit}`;
        ingredient.appendChild(value);
      }

      ingredients.appendChild(ingredient);
    });

    const sectionInformation = document.createElement("section");
    sectionInformation.classList.value = "recette__informations";
    sectionInformation.appendChild(ingredients);
    sectionInformation.appendChild(description);

    return sectionInformation;
  }

  render() {
    const $header = this.generateHeader();
    const $informationsSection = this.generateInformations();
    const $titleSection = this.generateTitle();
    const $body = this.generateBody($titleSection, $informationsSection);

    return this.generateCard($header, $body);
  }
}

//endregion

//region Filter
class AdvancedFilter {
  constructor(data) {
    this.data = data;
    this.filterContainer = document.querySelector(".filtres");
    this.filters = [
      ...this.filterContainer.querySelectorAll(".filtres__filtre"),
    ];
    this.searchBar = document.querySelector(".searchBar");
  }

  /**
   * Capitalize first Letter of word
   * @param word {string}
   * @return {string}
   */
  capitalize(word) {
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

  async getAllIngredients() {
    const arr = [];
    this.data.forEach((d) => {
      d.ingredients.forEach(({ ingredient }) => {
        arr.push(this.capitalize(ingredient));
      });
    });
    return [...new Set(arr)];
  }

  async getAllAppliance() {
    const arr = [];
    this.data.forEach((d) => {
      arr.push(d.appliance);
    });
    return [...new Set(arr)];
  }

  async getAllUstensiles() {
    const arr = [];
    this.data.forEach((d) => {
      d.ustensiles.forEach((ustensile) => {
        arr.push(this.capitalize(ustensile));
      });
    });
    return [...new Set(arr)];
  }

  renderItems(filtres) {
    const $categories = [...document.querySelectorAll(".filtres__list")];
    $categories.forEach(($category) => {
      const categoryName = $category.dataset.filterName;
      const activeCategory = filtres[categoryName];

      activeCategory.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        $category.appendChild(li);
      });
    });
  }

  closeWithKeyboard(e, dom) {
    console.log(e.key);
    if (e.key === "Escape") {
      dom.dataset.open = "false";
      document.removeEventListener("keydown", this.closeWithKeyboard);
    }
  }

  openDropDownMenu(filter) {
    // remove data-open from other filters
    this.filters
      .filter((f) => f !== filter)
      .forEach((f) => (f.dataset.open = "false"));

    // set data-open to true to active filter
    const timeout = setTimeout(() => {
      filter.dataset.open = "true";

      // Add Event Listener to keyboard Escape Key
      document.addEventListener("keydown", (e) =>
        this.closeWithKeyboard(e, filter)
      );
      clearTimeout(timeout);
    }, 300);
  }

  closeDropDownMenu(filter) {
    filter.dataset.open = "false";
  }

  handleDropDown() {
    return this.filters.forEach((filter) => {
      filter.querySelector("button").addEventListener("click", (e) => {
        e.preventDefault();
        switch (filter.dataset.open) {
          case "true":
            this.closeDropDownMenu(filter);
            break;
          case "false":
            this.openDropDownMenu(filter);
            break;
        }
      });
    });
  }

  async init() {
    const ingredients = await this.getAllIngredients();
    const appliance = await this.getAllAppliance();
    const ustensiles = await this.getAllUstensiles();
    const filtres = { ingredients, appliance, ustensiles };

    this.renderItems(filtres);
    this.handleDropDown();
  }
}

//endregion

//region App
class App {
  constructor() {
    this.url = "recipes.json";
    this.api = new Api(this.url);
    this.cardContainer = document.querySelector(".container");
    this.$searchBar = document.querySelector("#searchBar");
  }

  async mapData(data) {
    return await data.map((d) => new CardConstructor(d));
  }

  async renderData(data) {
    return data.forEach((d) => {
      const cardTemplate = new CardTemplate(d);
      const $card = cardTemplate.render();
      this.cardContainer.appendChild($card);
    });
  }

  async renderAdvancedFilter(data) {
    const advancedFilter = new AdvancedFilter(data);
    return advancedFilter.init();
  }

  removeCards = () => (document.querySelector(".container").innerHTML = "");
  removeAdvancedFilters = () =>
    [...document.querySelectorAll(".filtres__filtre ul")].forEach(
      (filter) => (filter.innerHTML = "")
    );

  async filterDataV1(data) {
    this.$searchBar.addEventListener("input", async (e) => {
      const input = this.$searchBar.value;

      let output = [];
      data.forEach((d) => {
        // Remove DOM element
        this.removeCards();
        this.removeAdvancedFilters();
        // regEx Pattern
        const pattern = new RegExp(input, "gi");
        // Filter by [title]
        if (pattern.test(d.name)) output.push(d);
        // Filter by [ingredient]
        d.ingredients.forEach((ingredient) => {
          if (pattern.test(d.ingredient)) output.push(d);
        });
        // Filter by [description]
        if (pattern.test(d.description)) output.push(d);
      });
      await this.renderData(output);
      await this.renderAdvancedFilter(output);
    });
  }

  /*  filterByTitle(input, data) {
      if (input.length < 3) return data;

      return data.filter((d) => {
        const pattern = new RegExp(input, "gi");
        return d.name.match(pattern) && d;
      });
    }*/

  async init() {
    const recettesData = await this.api.fetch();
    const recettes = await this.mapData(recettesData);

    await this.renderAdvancedFilter(recettes);
    await this.renderData(recettes);

    await this.filterDataV1(recettes);
  }
}

//endregion

const app = new App();
app.init();

// todo lire user story et faire schema de l'algorithme
