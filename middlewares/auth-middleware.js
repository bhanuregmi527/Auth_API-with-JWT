import jwt from "jsonwebtoken";
import userModel from "../model/User.js";


var checkUserAuth = async(req,res,next)=>{
    let token
    const {authorization}= req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token= authorization.split(' ')[1] 
            console.log(authorization)
            // verify token 
            const {userID}= jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log(userID)
            //GET USER FROM TOKEN
            req.user= await userModel.findById(userID).select("-password")
            next()
        } catch (error) {
            res.status(401).send({"status":"failed", "message":"unauthorized User"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed", "message":"unauthorized User, No Token"})
    } 
}
export default checkUserAuth 