import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDb from './config/conect.js'
import router from './routes/userRoutes.js'
import bodyParser from 'body-parser'

const app=express()
const DATABASE_URL=process.env.DATABASE_URL
const port = process.env.PORT 
//middleware
app.use(cors())
app.use(express.json())
app.use("/api/user",router)
app.use(bodyParser.urlencoded({ extended: true }));
//


//database
connectDb(DATABASE_URL)


app.listen(port,()=>{
    console.log(`app is listening at port ${port}`)
}) 