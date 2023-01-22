const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
//const SECRET_KEY = "ADMIN_API";
const nodemailer = require('nodemailer');
var mailOptions = {
    from: 'gametubg@gmail.com',
    to: 'kunalsaini8950@gmail.com',
    subject: 'Wrong Password Alert!!!',
    text: 'someone try to access your account!'
  };
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gametubg@gmail.com',
      pass: 'smggqrdkjfulzekx'
    }
  });
 
const auth = (req, res, next)=>{

    try {

        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            let user = jwt.verify(token, process.env.SECRET_KEY );
            req.userId = user.id;
        }
        else{
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return res.status(401).json({message: "Unauthorized User"});

        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Unauthorized User"});
    }

}

module.exports = auth;