require('dotenv').config()
const jwt=require('jsonwebtoken')
async function verifyToken(req,res,next){
  
const token=req.headers.token
console.log("where is token",token);

if(token){
    await jwt.verify(token,process.env.JWT_SECRET,(err,data)=>{
console.log("verify data",data);
if(err) return res.status(401).json("try again man 😅")
    if(data.userId==req.params.id){
        next()
    }else{
        return res.status(401).json("try again man 😅")
    }
    })
}else{
    console.log("to check data");
      return res.status(401).json("try again man 😅")
}
    
} 

module.exports={verifyToken}