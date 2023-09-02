import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import scrollMonitor from 'scrollmonitor';

Notify.init({
    position: 'right-bottom',
});

Loading.init({
    backgroundColor: 'rgba(0,0,0,0.3)',
    svgColor: 'rgb(60, 197, 218)',
    clickToClose: false,
});

const form$ = document.getElementById('search-form');
const imageContainer$ = document.querySelector('.gallery');

const search = new ApiService();
const lightBox = new SimpleLightbox('.gallery a');

const scrollListener = scrollMonitor.create(imageContainer$);
scrollListener.partiallyExitViewport(loadMore);

form$.addEventListener('submit', submitForm);

function submitForm(event) {
    event.preventDefault();
    imageContainer$.innerHTML = '';
    Loading.dots();
    search.searchQuery = form$.elements.searchQuery.value;
    search.resetPage();
    addImageAndUpdateUI();
}

function loadMore() {
    if (search.isMorePage()) {
        Loading.dots();
        addImageAndUpdateUI();
        return;
    }
    Notify.info("We're sorry, but you've reached the end of search results.");
}

async function addImageAndUpdateUI() {
    try {
        const image = await search.fetchImage();
        if (search.currentPage === 1 && search.totalHits !== 0) {
            Notify.success(`Hooray! We found ${search.totalHits} images.`);
        }

        renderImage(image.hits);
    } catch {
        Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }
}

function renderImage(array) {
    if (!array.length) {
        Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        );
        Loading.remove();
        return;
    }
    const markup = array
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) => {
                return `<div class="photo-card">
                    <a href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                        <ul class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </ul>
                    </a>
                </div>`;
            }
        )
        .join('');
    imageContainer$.insertAdjacentHTML('beforeend', markup);
    lightBox.refresh();

    Loading.remove();

    search.addPage();
}