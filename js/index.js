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

//region Card Template
class CardTemplate {
  constructor(data) {
    this.data = data;
  }

  generateCard(...children) {
    const $children = [...children];
    const $card = document.createElement("div");
    $card.classList.value = "recette";
    $card.dataset.id = this.data.id;

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

//region AdvancedFilter
class AdvancedFilter {
  constructor(data) {
    this.data = data;
    this.filterContainer = document.querySelector(".filtres");
    this.filters = [
      ...this.filterContainer.querySelectorAll(".filtres__filtre"),
    ];
    this.buttons = [...document.querySelectorAll(".filtres__button")];
    this.searchBar = document.querySelector(".searchBar");
    this.$tagsContainer = document.getElementById("tagsWrapper");
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

  async renderItems(filtres) {
    const $categories = [...document.querySelectorAll(".filtres__list")];
    $categories.forEach(($category) => {
      const categoryName = $category.dataset.filterName;
      const activeCategory = filtres[categoryName];

      activeCategory.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.dataset.active = "false";
        li.dataset.filterType = $category.dataset.filterName;
        $category.appendChild(li);
      });
    });
  }

  async appendTag(tag, li) {
    if (this.$tagsContainer.childNodes.length > 3)
      this.$tagsContainer.replaceChild(tag, this.$tagsContainer.lastChild);
    else this.$tagsContainer.appendChild(tag);
    this.handleTags(tag, li);
  }

  handleTags(tag, li) {
    tag
      .querySelector(".tag__btn")
      .addEventListener("click", (e) => this.removeTag(e, tag, li));
  }

  async removeTag(e, tag, li) {
    e.preventDefault();
    this.$tagsContainer.removeChild(tag);
    li.disabled = false;
    li.dataset.active = "false";
    document.removeEventListener("click", this.removeTag);
    await this.handleFilter();
  }

  async selectTag(li) {
    if (li.disabled) return;

    await this.renderTags(li);
    li.dataset.active = "true";
    li.disabled = true;
    this.closeDropDownMenu(li.parentNode.parentNode);
    await this.handleFilter();
  }

  async renderTags(li) {
    const { textContent: value, dataset } = li;

    const $icon = document.createElement("span");
    $icon.classList.value = "fa-regular fa-circle-xmark icon";
    $icon.ariaHidden = "true";

    const $btn = document.createElement("button");
    $btn.classList.value = "tag__btn";
    $btn.appendChild($icon);

    const $p = document.createElement("p");
    $p.classList.value = "tag__text";

    const $tag = document.createElement("li");
    $tag.classList.value = "tag";
    $tag.dataset.tag = dataset.filterType;
    $tag.textContent = value;
    $tag.appendChild($p);
    $tag.appendChild($btn);

    await this.appendTag($tag, li);
  }

  closeDropDownMenu(filter) {
    filter.dataset.open = "false";
    document.removeEventListener("click", this.selectTag);
  }

  closeWithKeyboard(e, dom) {
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

    //get all advanced tag filter
    const optionTags = [...filter.querySelectorAll("li")];

    // set data-open to true to active filter
    filter.dataset.open = "true";

    // click on tag to add it
    optionTags.forEach((li) => {
      li.addEventListener("click", async () => this.selectTag(li));
    });

    // Add Event Listener to keyboard Escape Key
    document.addEventListener("keydown", (e) =>
      this.closeWithKeyboard(e, filter)
    );
  }

  async handleDropDown() {
    return this.buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        switch (btn.parentNode.dataset.open) {
          case "true":
            this.closeDropDownMenu(btn.parentNode);
            break;
          case "false":
            this.openDropDownMenu(btn.parentNode);
            break;
        }
      });
    });
  }

  async handleFilter() {
    const tags = [...document.querySelectorAll(".tagsWrapper .tag")];
    for (const tag of tags) {
      const filter = new FilterData(this.data, tag.textContent);
      await filter.filterV1();
    }
  }

  async init() {
    const ingredients = await this.getAllIngredients();
    const appliance = await this.getAllAppliance();
    const ustensiles = await this.getAllUstensiles();

    await this.renderItems({ ingredients, appliance, ustensiles });
    await this.handleDropDown();

    // await this.handleFilter();
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

  removeCards() {
    return (document.querySelector(".container").innerHTML = "");
  }

  removeAdvancedFilters() {
    return [...document.querySelectorAll(".filtres__filtre ul")].forEach(
      (filter) => (filter.innerHTML = "")
    );
  }

  listenToKeyboard(e) {
    if (e.key === "Escape" || e.key === "Enter") {
      this.$searchBar.blur();
      document.removeEventListener("keydown", (e) => this.listenToKeyboard(e));
    }
  }

  async filterDataV1(recettes) {
    this.$searchBar.addEventListener("input", async (e) => {
      const input = this.$searchBar.value;

      // regEx Pattern
      /*      const pattern = new RegExp(input, "gi");
            this.removeCards();
            this.removeAdvancedFilters();*/

      // Quit Search Focus on Escape or Enter
      document.addEventListener("keydown", (e) => this.listenToKeyboard(e));
      const filter = new FilterData(recettes, input);
      await filter.filterV1();
      /*      let output = [];
            recettes.forEach((card) => {
              // Filter by [title]
              if (pattern.test(card.name)) output.push(card);
              // Filter by [description]
              else if (pattern.test(card.description)) output.push(card);
              // Filter by [ingredient]
              else
                card.ingredients.forEach((ingredient) => {
                  if (pattern.test(ingredient.ingredient)) output.push(card);
                });
            });
      
            if (input.length < 3) {
              await this.renderData(recettes);
              await this.renderAdvancedFilter(recettes);
            } else {
              await this.renderData(output);
              await this.renderAdvancedFilter(output);
            }*/
    });
  }

  async filterDataV1bis(data) {
    this.$searchBar.addEventListener("input", async (e) => {
      const input = this.$searchBar.value;
      let output = [];

      // regEx Pattern
      const pattern = new RegExp(input, "gi");
      this.removeCards();
      this.removeAdvancedFilters();

      // Quit Search Focus on Escape or Enter
      document.addEventListener("keydown", (e) => this.listenToKeyboard(e));

      for (let i = 0; i < data.length; i++) {
        const card = data[i];
        // Filter by [title]
        if (pattern.test(card.name)) output.push(card);
        // Filter by [description]
        else if (pattern.test(card.description)) output.push(card);
        // Filter by [ingredient]
        else {
          for (let j = 0; j < card.ingredients.length; j++) {
            if (pattern.test(card.ingredients[j].ingredient)) output.push(card);
          }
        }
      }
      if (input.length < 3) {
        await this.renderData(data);
        await this.renderAdvancedFilter(data);
      } else {
        await this.renderData(output);
        await this.renderAdvancedFilter(output);
      }
    });
  }

  async filterDataV2() {
    this.$searchBar.addEventListener("input", async (e) => {
      const input = this.$searchBar.value;
      // regEx Pattern
      const pattern = new RegExp(input, "gi");

      [...document.querySelectorAll(".container .recette")].forEach((card) => {
        // Filter by [title]
        if (pattern.test(card.querySelector("h3").textContent)) {
          document.querySelector(
            `.recette[data-id=${CSS.escape(card.dataset.id)}]`
          ).dataset.hidden = "false";
        }
        // Filter by [description]
        else if (
          pattern.test(card.querySelector(".recette__description").textContent)
        ) {
          document.querySelector(
            `.recette[data-id=${CSS.escape(card.dataset.id)}]`
          ).dataset.hidden = "false";
        } else {
          // Filter by [ingredient]
          [
            ...document.querySelectorAll(
              `.recette[data-id=${CSS.escape(card.dataset.id)}] .key`
            ),
          ].forEach((ingredient) => {
            console.log(ingredient.textContent);
            if (pattern.test(ingredient.textContent)) {
              document.querySelector(
                `.recette[data-id=${CSS.escape(card.dataset.id)}]`
              ).dataset.hidden = "false";
            } else
              document.querySelector(
                `.recette[data-id=${CSS.escape(card.dataset.id)}]`
              ).dataset.hidden = "true";
          });
        }
      });
    });
  }

  async init() {
    const recettesData = await this.api.fetch();
    const recettes = await this.mapData(recettesData);

    await this.renderAdvancedFilter(recettes);
    await this.renderData(recettes);

    await this.filterDataV1(recettes);
    // await this.filterDataV1bis(recettes);
    // await this.filterDataV2();
  }
}

//endregion

const app = new App();
app.init();

// todo lire user story et faire schema de l'algorithme

class FilterData {
  data;
  input;

  constructor(data, input) {
    this.data = data;
    this.input = input;
    this.output = [];
    this.pattern = new RegExp(input, "gi");
    this.app = new App();
  }

  async filterV1() {
    this.app.removeCards();
    this.app.removeAdvancedFilters();

    this.data.forEach((card) => {
      // Filter by [title]
      if (this.pattern.test(card.name)) this.output.push(card);
      // Filter by [description]
      else if (this.pattern.test(card.description)) this.output.push(card);
      // Filter by [ingredient]
      else
        card.ingredients.forEach((ingredient) => {
          if (this.pattern.test(ingredient.ingredient)) this.output.push(card);
        });
    });

    if (this.input.length < 3) {
      await this.app.renderData(this.data);
      await this.app.renderAdvancedFilter(this.data);
    } else {
      await this.app.renderData(this.output);
      await this.app.renderAdvancedFilter(this.output);
    }
  }
}

// todo Quand je fais une recherche sur avec la main nav-barre, les boutons des filtres avancés se désactive. Je pense qu'il s'agit d'un conflit d'event Listener
// todo Meme soucis lorsque je selectionne un tag pour filtrer les recettes
// todo revoir l'organisation des classes
// todo refactoriser et ranger dans plusieurs fichiers
// todo faire un diagramme || creer une forme d'interface