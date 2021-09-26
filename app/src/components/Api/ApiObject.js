import axios from 'axios';

const api = {

        register: (data) =>{
           return axios.post("api/register", data);
        
        }
            
};

export default api;
