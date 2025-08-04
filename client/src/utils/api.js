import axios from "axios";

const API = axios.create({
  baseURL: "https://labs-backend-8i1e.onrender.com",
});

export default API;
