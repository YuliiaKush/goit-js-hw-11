import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

error.classList.add('is-hidden');
breedSelect.classList.add('is-hidden');

fetchBreeds()
  .then(data => {
    breedSelect.classList.remove('is-hidden');
    loader.classList.add('is-hidden');

    const markup = data
      .map(({ id, name }) => `<option value="${id}">${name}</option>`)
      .join('');
    breedSelect.innerHTML = markup;
    new SlimSelect({
      select: breedSelect,
    });
  })
  .catch(err => {
    console.error(err);
    loader.classList.add('is-hidden');
    Notify.failure(error.textContent);
  });

breedSelect.addEventListener('change', setOutput);

function setOutput(evt) {
  catInfo.classList.add('is-hidden');
  loader.classList.remove('is-hidden');
  error.classList.add('is-hidden');

  fetchCatByBreed(evt.currentTarget.value)
    .then(data => {
      catInfo.classList.remove('is-hidden');
      loader.classList.add('is-hidden');

      const markup = data
        .map(
          ({
            url,
            breeds: [{ name, description, temperament }],
          }) => `<img src="${url}" alt="${name}" width='300px'>
          <div class="box">
          <h2>${name}</h2>
          <p>${description}</p>
          <p><b>Temperament:</b> ${temperament}</p>
          </div>`
        )
        .join('');
      catInfo.innerHTML = markup;
    })
    .catch(err => {
      console.error(err);
      loader.classList.add('is-hidden');
      Notify.failure(error.textContent);
    });
}