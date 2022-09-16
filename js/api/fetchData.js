/**
 *
 * @param url : string Url of data
 * @return {FetchEvent<JSON[]>}
 */
fetchData = async (url) => {
  const promise = await fetch(url);
  return await promise.json();
}