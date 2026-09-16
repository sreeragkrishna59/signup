import axios from "axios"

let Url="http://localhost:3000/diginet"

let token=JSON.parse(localStorage.getItem('persist:diginet'))&&JSON.parse(JSON.parse(localStorage.getItem('persist:diginet')).loginData)&&JSON.parse(JSON.parse(localStorage.getItem('persist:diginet')).loginData).token
console.log("finaly troken",token);

export let publicRequest=axios.create({
    baseURL:Url
})

export let ProtectRequest=axios.create({
    baseURL:Url,
    headers:{token}
})