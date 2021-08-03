import urls from '../Urls';
import get_storage from '../get_storage';

const axios = require("axios");
axios.defaults.timeout = 10000;

const delete_travel=async(id,resolve,reject)=>{
    get_storage("token")
    .then(token=>{
        axios({
            method:'delete',
            url:urls.SingleTravel+id,
            headers: { 'authorization': `Token ${token}`},
        })
        .then(response=>{
            console.log('response from delete_travels ',response.data);
            if (response.status==204)
            resolve({type:"REMOVE_TRAVEL",payload:id})
            else 
            reject()
        })
        .catch((err)=>{
            console.log("error from componnents/home/deleteTravels.js ",err);
            reject()
        })
    })
    
}

export default delete_travel;