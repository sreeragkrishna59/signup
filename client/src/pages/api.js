import axios from 'axios'
import { storeData } from '../Redux/userSlice';
import { ProtectRequest, publicRequest } from './axiosPage';

async function signupData(values){
    try{
let backendData=await publicRequest.post(`/signup`,values,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
);
return backendData.data
    }catch(err){
return err.message
    }
}

async function loginData(values,dispatch){
    try{
let backendData=await publicRequest.post(`/login`,values);
console.log("login success check",backendData.data);
dispatch(storeData(backendData.data))
return backendData.data
    }catch(err){
      console.log("login error check",err.response.message);     
return err.response.message
    }
}

async function getHome(id){  
    try{
let singleData=await ProtectRequest.get(`/getData/${id}`)
console.log("********************",singleData.data.SingleData);
return singleData.data.SingleData
    }catch(err){
console.log("err message from getHome",err);
    }
}
export {signupData,loginData,getHome}