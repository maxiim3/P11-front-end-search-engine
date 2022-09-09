class Api {
  constructor(url) {
    this.url = url;
  }

  async fetch() {
    const promise = await fetch(this.url);
    return await promise.json();
  }
}