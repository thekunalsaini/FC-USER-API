const express = require("express");
const { signup, signin, getdata, getdatabyid,getdatabyupi,addmoney,changebyid,changebyupi,changebyneft,deletebyid,profileDetails,userdetails } = require("../controllers/userController");
const userRouter = express.Router();

const auth = require("../middlewares/auth");
const adminauth = require("../middlewares/adminauth");
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/profile", auth, profileDetails)
userRouter.get("/cachedata", userdetails)
userRouter.get("/admin/data",adminauth,getdata);//admin
userRouter.get("/data/:id",getdatabyid);//...
userRouter.get("/dataupi/:upi",auth,getdatabyupi);
userRouter.put("/addmoney/:id", auth,addmoney);
userRouter.put("/changeprofile/:id", changebyid);//...
userRouter.put("/changebyupi/:upi", changebyupi);//...
userRouter.put("/changebyneft/:upi", auth,changebyneft);//... use fetch security
userRouter.delete("/admin/user/:id",adminauth,deletebyid);//admin

module.exports = userRouter;