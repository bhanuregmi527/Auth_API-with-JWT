import userModel from "../model/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

class UserController{
    static userRegistration = async (req,res)=>{
       
    
        const {name,email,password,password_confirm,tc}=req.body
        const user= await userModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exit"})
            }else{
            if(name&&email&&password&& password_confirm&& tc){
                if(password===password_confirm){
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword= await bcrypt.hash(password,salt)
                  
                        const doc = new userModel({
                        name,email,password:hashPassword,tc
                    })
                    await doc.save()
                    const saved_user= await userModel.findOne({email:email})
                    // generate JWT token
                   const secret = process.env.JWT_SECRET_KEY
                    const token= jwt.sign({userID:saved_user._id},secret,{expiresIn:'5d'})
                    console.log(token)
                    res.send({"status":"success","message":"Registration success","token":token})
                    
                    } catch (error) {
                      console.log(error)  
                    }

                }else{
                    res.send({"status":"failed","message":"password and password_confirm doesnot match"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})  
            }
        }
    }

    static userLogin = async (req,res)=>{
    
        try {
            const {email,password}=req.body
            if(email&&password){
                const user= await userModel.findOne({email:email})
              
                if(user !==null){
                    const isMatch= await bcrypt.compare(password,user.password)
                    if((user.email===email) && isMatch){
                        //generate JWT token
                        const secret = process.env.JWT_SECRET_KEY
                        const token = jwt.sign({userID:user._id},secret,{expiresIn:'5d'})

                        res.send({"status":"success","message":"Login successfully","token":token})

                    }else{
                        res.send({"status":"failed","message":"Email or password doesnot match"})
                    }
                }else{
                    res.send({"status":"failed","message":"Your are not a Registered User"}) 
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})  
            }
        } catch (error) {
            console.log(error)
        }
    }

    static changeUserPassword= async (req,res)=>{
        const {password,password_confirm}=req.body
        if(password&&password_confirm){
            if(password!==password_confirm){
                res.send({"status":"failed","message":"Password and Password-confirm doesnot match"}) 
            }else{
                const salt= await bcrypt.genSalt(10) 
                const newHashPassword= await bcrypt.hash(password,salt)
                await userModel.findByIdAndUpdate(req.body._id, {$set:{
                   password:newHashPassword 
                }})
                console.log(req.user)
                res.send({"status":"failed","message":"Password Changed Succesfully"}) 
            }
        }else{
            res.send({"status":"failed","message":"All fields are required"}) 
        }
    }
    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
      }
}
export default UserController
