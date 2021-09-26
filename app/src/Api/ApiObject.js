import axios from 'axios';

class Api{

    constructor(){}

    register = (data) =>{
        return axios.post("api/register", data);
    }

}

export default Api;
