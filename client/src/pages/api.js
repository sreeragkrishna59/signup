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
async function getHome(id,token){  
    try{
let singleData=await publicRequest.get(`/getData/${id}`,{headers:{token:token}})
console.log("********************",singleData.data.SingleData);
return singleData.data.SingleData
    }catch(err){
console.log("err message from getHome",err);
    }
}
async function updateUser(id,token,data){  
    try{
let singleData=await publicRequest.put(`/updateUser/${id}`,data,{headers:{token:token,"Content-Type":"multipart/form-data"}})
console.log("********************",singleData.data.SingleData);
return singleData.data.SingleData
    }catch(err){
console.log("err message from getHome",err);
    }
}


async function deleteUser(id,token){
    try{
let resBackend=await publicRequest.delete(`/deleteData/${id}`,{headers:{token:token}})
console.log("delete update",resBackend);
return resBackend.data.success
    }catch(err){
        console.log("err in delete methods",err.response.data);      
return err.response.data
    }
}

export {signupData,loginData,getHome,updateUser,deleteUser}