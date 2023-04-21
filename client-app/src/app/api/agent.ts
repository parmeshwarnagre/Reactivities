//centralized APi call
import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
const sleep=(delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL='http://localhost:5000/api';
//use axios interceptors to place the delay
// axios.interceptors.response.use( response=> {
//     return sleep(1000).then(() => {
//         return response;
//     }).catch((error) => {
//         console.log(error);
//         return Promise.reject(error);
//     });
// })
axios.interceptors.response.use( async response=> {
    try{
         sleep(1000);
        return response;
    }catch(error) {
        
        return Promise.reject(error);
    }
})


const responseBody=<T>(response :AxiosResponse<T>)=> response.data;

//making request

const requests={
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string,body: {}) => axios.post<T>(url,body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url,body).then(responseBody),
    del:<T>(url: string) => axios.delete<T>(url).then(responseBody),
}
//create an object that can store the request for activities
const Activities = {
    list: ()=> requests.get<Activity[]>('/activities'),
    details:(id:string)=>requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity)=> axios.post<void>(`/activities`,activity),
    update:(activity: Activity)=> axios.put<void>(`/activities/${activity.id}`,activity),
    delete: (id:string)=>axios.delete<void>(`/activities/${id}`)
}
const agent = {
    Activities
}
export default agent;