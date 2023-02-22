import axios from "axios";
const baseURL = "https://pixabay.com/api/";
const key = "33828214-48c91a6a5d61090f6e4b0f82c";
const searchOptions = "image_type=photo&orientation=horizontal&safesearch=true"; //

export default async function fetchPictures(query, page = 1) {
    const URL = `${baseURL}/?key=${key}&q=${query}&${searchOptions}&page=${page}&per_page=40`;
    return await axios.get(URL)
};