import axios from 'axios';

const api = {

        register: (data) =>{
                return axios.post("api/register", data);
        },

        login: (data) =>{
                return axios.post("api/login", data);
        }
            
};

export default api;
