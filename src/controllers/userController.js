const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {validation} = require("../utills/validationSchema");
const NodeCache = require('node-cache')
const myCache = new NodeCache()
const SECRET_KEY = process.env.SECRET_KEY;
//const SECRET_KEY = "ADMIN_API";
const nodemailer = require('nodemailer');
const { encrypt, decrypt} = require('../utills/AES')
const { Keyvalidation} = require('../utills/keysValidation')
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gametubg@gmail.com',
      pass: 'smggqrdkjfulzekx'
    }
  });

const signup = async (req, res) =>{

    const {username, email, password, secure_word, amount, DOB, upi, gender, address, acard , key1, key2, key3} = req.body;
    try {

        //console.log(req.body)
        //Keyvalidation([key1,key2,key3])
        const err  = Keyvalidation(
            [req.body.key1,req.body.key2,req.body.key3]
            );

        if (err){
            //await userModel.findByIdAndRemove(result.id);
            return res.status(400).json({ error: true,message: err});
        }


        const { error } = validation(req.body);
        if (error)
            return res.status(400).json({ error: true, message: error.details[0].message });


        const existingUser = await userModel.findOne({ email : email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username,
            secure_word: encrypt(secure_word),
            amount: amount,
            DOB: DOB,
            upi: upi,
            gender: gender,
            address: address,
            acard: acard,
            key1: encrypt(key1),
            key2: encrypt(key2),
            key3: encrypt(key3)
        });

        const token = jwt.sign({email : result.email, id : result._id }, process.env.SECRET_KEY,{expiresIn:'15m'});
        //res.status(201).json({user: result, token: token});
        res.status(201).json({message: "Account created sucessfully", token: token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:true,message: "Something went wrong"});
    }

}
// const signUpUser = async (req, res) =>{
//     const {userName, email, password} = req.body;
//     try {
//         const { error } = validation(req.body);
//         if (error)
//             return res.status(400).json({ error: true, message: error.details[0].message });
//         const existingUser = await userModel.findOne({ email : email});
//         if(existingUser){
//             return res.status(400).json({message: "User already exists"});
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const result = await userModel.create({
//             email: email,
//             password: hashedPassword,
//             userName: userName
//         });
//         res.status(201).json({error: false, message: "Account created sucessfully"});
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error:true,Message:"Internal server error!!"});
//     }
// }
const getdata = async (req, res) =>{
    try {
        
        const notes = await userModel.find({});
        res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}
var mailOptions = {
    from: 'gametubg@gmail.com',
    to: 'kunalsaini8950@gmail.com',
    subject: 'Login Alert!!!',
    text: 'Successfully Login in your account!'
  };
  
  
const signin = async (req, res)=>{
    
    const {email, password} = req.body;

    try {
        
        const existingUser = await userModel.findOne({ email : email});
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchPassword){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = jwt.sign({email : existingUser.email, id : existingUser._id }, process.env.SECRET_KEY,{expiresIn:'15m'});
        res.status(200).json({user: existingUser, token: token});
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}
const getdatabyid = async (req, res) =>{
    try {
        
        const notes = await userModel.findById({_id : req.params.id});
        res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}
const getdatabyupi = async (req, res) =>{
    try {
        
        const notes = await userModel.find({upi : req.params.upi});
        res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}
const deletebyid = async (req, res) =>{

    const id = req.params.id;
    try {
        
        const note = await userModel.findByIdAndRemove(id);
        res.status(202).json(note);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}
const addmoney = async (req, res) =>{
    //const id = req.params.id;
    
            user1 = await userModel.find({_id : req.params.id})
            console.log(user1[0].amount)
            if (user1 == null) {
                res.status(404).json({ message: `user with specified id: ${req.params.id} does not exists` });
            } else {
                   await userModel.updateOne({ _id: req.params.id }, {
                    amount: user1[0].amount + req.body.amount
                
                })
                res.status(200).json({ message: 'amount Updated Successfully' });
            }
        }

const changebyid = async (req, res) =>{
    data = req.params.id.split("*");
    console.log(data)
    
            user1 = await userModel.find({upi : data[0]});
            console.log(user1[0].amount)
            if (user1 == null) {
                res.status(404).json({ message: `user with specified id: ${data[0]} does not exists` });
            } else {
                userModel.updateOne({ _id: user1[0]._id }, {
                    amount: user1[0].amount-parseInt(data[1])
                
                }, (err) => {
                    if (!err) {
                        res.status(200).send({ message: ' Updated Successfully' });
                    } else {
                        throw err;
                    }
                })
                user2 = await userModel.find({upi : data[0]});
                console.log(user2[0].amount)
                //res.status(200).json({ message: ' Updated Successfully' });
            }
        }

const changebyupi = async (req, res) =>{
    
    try {
        data = req.params.upi.split("*");
        console.log(data)
        const notes = await userModel.find({upi : data[0]});
        console.log(notes[0].amount)
        userModel.updateOne({ _id: notes[0]._id }, {
        amount: notes[0].amount+parseInt(data[1])}, (err) => {
            if (!err) {
                res.status(200).send({ message: ' Updated Successfully' });
            } else {
                throw err;
            }
        })
        notes1 = await userModel.find({upi : data[0]});
        console.log(notes1[0].amount)
        //res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
                 
           

}
const changebyneft = async (req, res) =>{
    
    try {
        data = req.params.upi.split("*");
        console.log(data)
        const notes = await userModel.find({_id : data[0]});
        console.log(notes[0].amount)
        userModel.updateOne({ _id: notes[0]._id }, {
        amount: notes[0].amount+parseInt(data[1])}, (err) => {
            if (!err) {
                res.status(200).send({ message: ' Updated Successfully' });
            } else {
                throw err;
            }
        })
        // notes1 = await userModel.find({upi : data[0]});
        // console.log(notes1[0].amount)
        //res.status(200).json(notes);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
                 
           

}
const profileDetails = async(req, res) => {
    userModel.find({_id : req.userId}, (err, docs) => {
        if (!err) {
            res.status(200).json({error:false,Profile:docs});
        } else {
            res.send(err);
        }
    });
}
const userdetails = async(req, res) => {
    userModel.find({}, (err, docs) => {
      if(myCache.has('uniqueeKey')){
        console.log('Retrieved value from cache !!')
        // res.send(myCache.get('uniqueeKey'))
        res.status(200).json(myCache.get('uniqueeKey'));
      }else{
      let result = {error:false,Profile:docs};
        myCache.set('uniqueeKey',result)
        console.log('Value not present in cache,'
            + ' performing computation')
        res.json(result)
      }
    });
  }
module.exports = { signup, signin, getdata ,getdatabyid,getdatabyupi,addmoney,changebyid,changebyupi,changebyneft,deletebyid, profileDetails,userdetails};