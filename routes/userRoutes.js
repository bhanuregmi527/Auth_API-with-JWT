import express, { Router } from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

// Route Level Middleware -to protect
router.use('/changepassword',checkUserAuth)
router.use('/loggedUser',checkUserAuth)


//Publice Routes
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)

//private routes
router.post('/changePassword',UserController.changeUserPassword)
router.get('/loggedUser',UserController.loggedUser)



export default router