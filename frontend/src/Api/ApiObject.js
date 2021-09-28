import axios from 'axios';

const api = {

  register: (data) => {
    return axios.post("api/register", data);
  },

  addProduct: (data, pizzeriaName) => {
    return axios.put(`/api/pizzeria/${pizzeriaName}/menu`, data)
  }

};

export default api;
