import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://g1-eis-backend.herokuapp.com'


const createHeadesrWithToken = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token")
  }
})

const api = {

  register: (data) => {
    return axios.post(baseURL + "/api/register", data);
  },

  login: (data) => {
    return axios.post(baseURL + "/api/login", data);
  },

  addProduct: (data, pizzeriaName) => {
    return axios.put(`${baseURL}/api/pizzeria/${pizzeriaName}/menu`, data, createHeadesrWithToken())
  },

  getMenu: (pizzeriaName) => {
    return axios.get(`${baseURL}/api/pizzeria/${pizzeriaName}/menu`)
  },

  deleteProduct: (pizzeriaName, productName) => {
    return axios.delete(`${baseURL}/api/pizzeria/${pizzeriaName}/menu/${productName}`);
  },

  updateProduct: (nameOfProductToUpdate, productData) => {
    const pizzeriaName = localStorage.getItem("username")
    return axios.put(`${baseURL}/api/pizzeria/${pizzeriaName}/menu/${nameOfProductToUpdate}`, productData, createHeadesrWithToken());
  },

  searchPizzeria: (data) => {
    return axios.get(`${baseURL}/api/search/pizzeria`, { params: data })
  },
  
  getPizzeria: (pizzeriaName) => {
    return axios.get(`${baseURL}/api/pizzeria/${pizzeriaName}`);
  }

};

export default api;
