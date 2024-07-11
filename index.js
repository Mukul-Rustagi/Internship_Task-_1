const express=require('express');
const app=express();

require("dotenv").config();
const PORT=process.env.PORT ;

app.use(express.json());
require("./config/databse").connect();

// route import and mount
const user=require("./routes/user");
app.use("/api/v1",user);


app.use("/",(req,res)=>{
    res.json({
        status:"API WORKING FINE",
        code:200
    });
})
// activate
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})


