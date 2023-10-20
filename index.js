const connection =require("./config/db")
const express=require("express")
const app=express()
app.use(express.json())
const cors=require('cors')
app.use(cors())
require("dotenv").config()
const userRouter=require("./routes/userRoute")
const projectRouter=require("./routes/projectRoute")
const taskRouter=require("./routes/taskRoute")
const teamRouter=require("./routes/teamRoute")

app.use("/user",userRouter)
app.use("/project",projectRouter)
app.use("/task",taskRouter)
app.use("/team",teamRouter)

app.get("/",(req,res)=>{
    res.send("It is working!")
})











app.listen(process.env.PORT,async()=>{
    try{
    console.log(`Listening to port ${process.env.PORT}`)
    await connection
    console.log("Database Connected")
    }
    catch(err){
        console.log(err)
    }
})

