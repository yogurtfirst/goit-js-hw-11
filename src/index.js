import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchPictures from "./fetchPictures";

const search = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const btn = document.querySelector(".load-more");

let page = 1;
let query = '';

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
            return response.data.hits;
        })
        .then(data => {
            if (data.length === 0) {
                return Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            };
            console.log(data);
            addMarkup(data);
        })
        .catch(error => {
            Notiflix.Notify.failure(error);
        });
    page += 1;
};

function onSubmit(event) {
    event.preventDefault();
    query = search.elements.searchQuery.value.trim();
    console.log(query);
    console.log(query.length);
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

search.addEventListener('submit', onSubmit);
btn.addEventListener('click', loadMore(query));

console.log(query);
console.log(query.length);