import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('ul.country-list');
const countryInfo = document.querySelector('div.country-info');

searchBox.addEventListener(
  'input',
  debounce(() => {
    getCountriesByName(searchBox.value, countryList, countryInfo);
  }, DEBOUNCE_DELAY)
);

function getCountriesByName(name, listNode, infoNode) {
  name = name.trim();
  if (name) {
    listNode.innerHTML = '';
    infoNode.innerHTML = '';

    fetchCountries(name)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        countriesInfoHTMLBuilder(data, listNode, infoNode);
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function countriesInfoHTMLBuilder(countriesData, listNode, infoNode) {
  if (countriesData.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  let listContent = '';
  countriesData.map(c => {
    listContent += `
        <li>
          <img class="country-list__flag" src="${c.flags.svg}" /><p class="country-list__name">${c.name}</p>
        </li>
      `;
  });
  listNode.insertAdjacentHTML('afterbegin', listContent);

  if (countriesData.length === 1) {
    const c = countriesData[0];

    let infoContent = `
      <ul class="info">
        <li>
          <p class="info__title">Capital:</p><p>${c.capital}</p>
        </li>
        <li>
          <p class="info__title">Population:</p><p>${c.population}</p>
        </li>
        <li>
          <p class="info__title">Languages:</p><p>${c.languages.map(lang => lang.name).join(', ')}</p>
        </li>
      </ul>
    `;
    infoNode.insertAdjacentHTML('afterbegin', infoContent);
  }
}
