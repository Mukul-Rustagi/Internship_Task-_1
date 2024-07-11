// const mongoose=require("mongoose");

// require("dotenv").config();

// exports.connect=()=>{
//     mongoose.connect(process.env.MONGO_URI,{
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     })

//     .then(()=>{console.log("DB ka Connection Successful")})
//     .catch((err)=>{
//         console.log("DB Conection Issues");
//         console.error(err);
//         process.exit(1);

//     });
// }

const mongoose = require('mongoose');

require("dotenv").config();
exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

