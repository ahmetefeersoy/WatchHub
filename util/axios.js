import axios from "axios";

const instance = axios.create({
  baseURL: "https://movieapi-production-2474.up.railway.app"
});

export default instance;
