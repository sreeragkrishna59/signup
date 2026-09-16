import {createSlice} from '@reduxjs/toolkit'

const loginDataStore=createSlice({
    name:"loginInfo",
    initialState:{
        loginData:null
    },
    reducers:{
        storeData:(state,action)=>{
state.loginData=action.payload
        },
        removeDatass:(state,action)=>{
            state.loginData=null
        }
    }
})

export const {storeData,removeDatass}=loginDataStore.actions
export default loginDataStore.reducer  

