const jwt =require("jsonwebtoken");
require("dotenv").config();


exports.auth=(req,res,next)=>{
    try{
      // extract jwt token
      const token=req.body.token;
      if(!token)
      {
        return res.status(500).json({
            success:false,
            messgae:"Token missing",
        });
      }

    //   verify Token
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decode);

        req.user=decode;
    }

    catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:'Token is invalid',
        });
    }
        next();
    }
    catch(err)
    {
        return res.status(401).json({
            success:false,
            message:'Something went Wrong',
        });
    }
}


exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role!="Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for studennt',
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role is not matching',
        });
    }
}


exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!="Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admin',
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role is not matching',
        });
    }
}