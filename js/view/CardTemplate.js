class CardTemplate {
  constructor(data) {
    this.data = data
  }

  generateCard(...children) {
    const $children = [...children]
    const $card = document.createElement("div")
    $card.classList.value = "recette"
    $card.dataset.id = this.data.id

    $children.forEach(child => $card.appendChild(child))

    return $card
  }

  generateBody(...children) {
    const $children = [...children]
    const $body = document.createElement("section")
    $body.classList.value = "recette__body"
    $children.forEach(child => $body.appendChild(child))

    return $body
  }

  generateHeader() {
    return document.createElement("header")
  }

  generateTitle() {
    const timeIcon = document.createElement("span")
    timeIcon.classList.value = "fa-regular fa-clock"

    const time = document.createElement("p")
    time.textContent = this.data.time
    time.prepend(timeIcon)

    const title = document.createElement("h3")
    title.textContent = this.data.name

    const sectionTitle = document.createElement("section")
    sectionTitle.classList.value = "recette__title"
    sectionTitle.appendChild(title)
    sectionTitle.appendChild(time)

    return sectionTitle
  }

  generateInformations() {
    const description = document.createElement("p")
    description.classList.value = "recette__description"
    description.textContent = this.data.description

    const ingredients = document.createElement("ul")
    ingredients.classList.value = "recette__ingredients"

    this.data.ingredients.forEach(i => {
      const ingredient = document.createElement("li")

      const key = document.createElement("span")
      key.classList.value = "key"
      key.textContent = `${i.ingredient}`
      ingredient.appendChild(key)

      if (i.quantityUnit) {
        const value = document.createElement("span")
        value.classList.value = "value"
        value.textContent = ` : ${i.quantityUnit}`
        ingredient.appendChild(value)
      }

      ingredients.appendChild(ingredient)
    })

    const sectionInformation = document.createElement("section")
    sectionInformation.classList.value = "recette__informations"
    sectionInformation.appendChild(ingredients)
    sectionInformation.appendChild(description)

    return sectionInformation
  }

  render() {
    const $header = this.generateHeader()
    const $informationsSection = this.generateInformations()
    const $titleSection = this.generateTitle()
    const $body = this.generateBody($titleSection, $informationsSection)

    return this.generateCard($header, $body)
  }
}
