const express=require("express");
const router=express.Router();

const {login,signup,forgotPassword}=require("../controller/Auth.js");
const{auth,isStudent,isAdmin}=require("../middleware/auth")


router.post("/login",login);
router.post("/signup",signup);
router.post("/forgotPassword",forgotPassword);

router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome Procted Route for the Tests',
    });
});

router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome Procted Route for the Student',
    });
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome Procted Route for the Admin',
    });
});
module.exports=router;