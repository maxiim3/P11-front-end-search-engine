class Api {
  constructor(url) {
    this.url = url;
  }

  async fetch() {
    const promise = await fetch(this.url);
    return await promise.json();
  }
}

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

  get ingredients() {
    return this._ingredients;
  }

  get time() {
    return this._time;
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

class CardTemplate {
  constructor(data) {
    this.data = data;
  }

  render() {
    const description = document.createElement("p");
    description.classList.value = "recette__description";
    description.textContent = this.data.description;

    const ingredients = document.createElement("ul");
    ingredients.classList.value = "recette__ingredients";

    this.data.ingredients.forEach((i) => {
      const key = document.createElement("span");
      key.classList.value = "key";
      key.textContent = `${i.ingredient}: `;

      const value = document.createElement("span");
      value.classList.value = "value";
      value.textContent = i.quantity + i?.unit;

      const ingredient = document.createElement("li");
      ingredient.appendChild(key);
      ingredient.appendChild(value);

      ingredients.appendChild(ingredient);
    });

    const timeIcon = document.createElement("p");
    timeIcon.classList.value = "fa-regular fa-clock";

    const time = document.createElement("p");
    time.textContent = this.data.time;
    time.prepend(timeIcon);

    const title = document.createElement("h3");
    title.textContent = this.data.name;

    const body = document.createElement("section");
    body.classList.value = "recette__body";
    body.appendChild(title);
    body.appendChild(time);
    body.appendChild(ingredients);
    body.appendChild(description);

    const header = document.createElement("header");

    const card = document.createElement("div");
    card.classList.value = "recette";
    card.appendChild(header);
    card.appendChild(body);

    return card;
  }
}

class Filter {
  constructor(data) {
    this.data = data;
    this.filterContainer = document.querySelector(".filtres");
    this.filters = [
      ...this.filterContainer.querySelectorAll(".filtres__filtre"),
    ];
    this.searchBar = document.querySelector('.searchBar')
  }


}

class App {
  constructor() {
    this.url = "recipes.json";
    this.api = new Api(this.url);
    this.cardContainer = document.querySelector(".container");
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

  async init() {
    const recettesData = await this.api.fetch();
    const recettes = await this.mapData(recettesData);
    await this.renderData(recettes);

    const filter = new Filter(recettes);

  }
}

const app = new App();
app.init();

// todo lire user story et faire schema de l'algorithme