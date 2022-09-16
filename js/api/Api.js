fetchData = async (url) => {
  const promise = await fetch(url);
  return await promise.json();
}