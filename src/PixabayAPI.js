import axios from 'axios';

const PER_PAGE = 40;
const API_KEY = "39215490-1df4b908442b0003db4e23bf7";
const BASE_URL = 'https://pixabay.com/api/';

export default class ApiService {
    #searchQuery;
    #page;
    #totalHits;

    constructor() {
        this.#searchQuery = '';
        this.#page = 1;
        this.#totalHits = 0;
    }

    addPage() {
        this.#page += 1;
    }

    resetPage() {
        this.#page = 1;
    }

    isMorePage() {
        return PER_PAGE * (this.#page - 1) < this.#totalHits;
    }

    get totalHits() {
        return this.#totalHits;
    }

    get currentPage() {
        return this.#page;
    }

    set searchQuery(value) {
        this.#searchQuery = value;
    }

    async fetchImage() {
        const response = await axios.get(
            `${BASE_URL}?key=${API_KEY}&q=${this.#searchQuery
            }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${this.#page
            }`
        );

        this.#totalHits = response.data.totalHits;

        return response.data;
    }
}