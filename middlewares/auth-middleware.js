import jwt from "jsonwebtoken";
import userModel from "../model/User.js";


var checkUserAuth = async(req,res,next)=>{
    let token
    const {authorization}= req.headers
    if(authorization && authorization.startswith('Bearer')){
        try {
            token= authorization.split(' ')[1]
            // verify token 
            const {userId}= jwt.verify(token, process.env.JWT_SECRET_KEY)

            //GET USER FROM TOKEN
            req.user= await userModel.findById(userId).select(-password)
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