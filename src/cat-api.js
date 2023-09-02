const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_EKd2UlnPb8URTekBO7zn7Y2cF3wKv184y8FyhhImyZOfYvrqqM064cXk1gAA6umB';

function fetchBreeds() {
  return fetch(`${BASE_URL}/breeds?api_key=${API_KEY}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    return resp.json();
  });
}

function fetchCatByBreed(breedId) {
  const BASE_URL = 'https://api.thecatapi.com/v1';

  return fetch(
    `${BASE_URL}/images/search?api_key=${API_KEY}&breed_ids=${breedId}`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    return resp.json();
  });
}

export { fetchBreeds, fetchCatByBreed };