import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchPictures from "./fetchPictures";

const search = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const btn = document.querySelector(".load-more");

let page = 1;
let query = '';
let maxHits = 0;

function clearMarkup() {
    page = 1;
    gallery.innerHTML = "";
};

function addElementMarkup(webformatURL, largeImageURL, tags, likes, views, comments, downloads) {
    const galleryMarkup = gallery.innerHTML;
    const newItem = `<a href="${largeImageURL}" class="photo-card">
                        <img src="${webformatURL}" alt="${tags}" class="image-item" loading="lazy" />
                        <div class="info">
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
                        </div>
                    </a>`;
    gallery.innerHTML = galleryMarkup + newItem;
};

function addMarkup(data) {
    data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => addElementMarkup(webformatURL, largeImageURL, tags, likes, views, comments, downloads));
    var lightbox = new SimpleLightbox('.gallery a', {
        captionsData: "alt",
        captionPosition: "bottom",
        captionDelay: 250,
    });
};

function loadMore(query) {
    fetchPictures(query, page)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status);
            }
            maxHits = response.data.totalHits;
            if (page === 2) Notiflix.Notify.success(`Hooray! We found ${maxHits} images.`);;
            return response.data.hits;
        })
        .then(data => {
            if (data.length === 0) {
                return Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            };
            addMarkup(data);
        })
        .catch(error => {
            Notiflix.Notify.failure(error);
        });
    
    btn.style.display = "block";
    page += 1;
};

function onSubmit(event) {
    event.preventDefault();
    query = search.elements.searchQuery.value.trim();
    if (query.length === 0) {
        return clearMarkup();
    } else if (query.length === 1) {
        clearMarkup();
        return Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
    } else {
        clearMarkup();
        return loadMore(query);
    }
};

function onNeedMore() {
    if (maxHits < 40 * (page-1)) {
        return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    };
    loadMore(query);
};

btn.style.display = "none";
search.addEventListener('submit', onSubmit);
btn.addEventListener('click', onNeedMore);