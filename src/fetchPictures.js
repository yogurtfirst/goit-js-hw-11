import axios from "axios";
const URL = "https://restcountries.com/v3.1/name/";

export default function fetchPictures(name) {
    return axios.get(`${URL}${name}?fields=name,capital,population,flags,languages`);
};