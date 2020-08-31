const app = require("express");
const router = app.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// const mongo = require("mongodb");
// const assert = require("assert");
//const users = require("../../controllers/controller.js");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
// const EMAIL_SECRET = require("../../config/keys");
// const nodemailer =require ("nodemailer");
// const xoauth2 = require('xoauth2');
// @route POST api/users/register
// @desc Register user
// @access Public

// router.get('/confirmation/:token', async (req, res) => {
//   console.log("token raead");
//   try {
//     const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET);
//     await models.User.update({ confirmed: true }, { where: { id } });
//   } catch (e) {
//     res.send('error');
//   }

//   return res.redirect('http://localhost:3000/login');
// });
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ email: req.body.email.toLowerCase() }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          password: req.body.password,
          dateofbirth: req.body.dateofbirth,
          confirmed:false
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
              // async email 
      // jwt.sign(
      //   {
      //     user: _.pick(user, 'id'),
      //   },
      //   EMAIL_SECRET,
      //   {
      //     expiresIn: '1d',
      //   },
      //   (err, emailToken) => {
      //     const url = `http://localhost:8080/confirmation/${emailToken}`;

      //     transporter.sendMail({
      //       to: args.email,
      //       subject: 'Confirm Email',
      //       html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      //     });
      //   },
      // );
      // try {
      //   const emailToken = jwt.sign(
      //     {
      //       user: _.pick(user, 'id'),
      //     },
      //     EMAIL_SECRET,
      //     {
      //       expiresIn: '1d',
      //     },
      //   );

      //   const url = `http://localhost:3000/confirmation/${emailToken}`;

      //   await transporter.sendMail({
      //     to: args.email,
      //     subject: 'Confirm Email',
      //     html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      //   });
      // } catch (e) {
      //   console.log(e);
      // }  
    main(newUser.email);
    }
    });
  });
  // // Retrieve all Users
  //, { session: false }
// router.get('/', function (req,res) { previous stamp from public version
  router.get('/', passport.authenticate('jwt', { session: false }), (req,res) => { //passport makes it private
  
    User.find({}, { _id : 1, email : 1, dateofbirth:1, name:1 }, function(err,users){
    if(err){
      res.send('something went wrong');
      next;
    }
    // let data = json(users);
    // console.log("test ", users);
    // data.forEach((item) => {
    //   console.log("found: ", item)
    //   console.log("found email: ", item.email)
    //   console.log("found dob:", item.dateofbirth)
    // });
    res.json(users);
  });

});
// @route GET api/users/currentuser	
// @desc Return current user	
// @access Private	
router.get(
  "/currentuser",	
  
  passport.authenticate('jwt', { session: false }),	
  (req, res) => {	
    res.json({	
      id: req.user.id,	
      name: req.user.name,	
      email: req.user.email	
    });	
  }	
);	


  // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email.toLowerCase();
    const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
      // if(!user.confirmed){
      //   return res.status(404).json({ email: "Email has not been confirmed, please confirm to log in" });
      // }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });
  



// // async..await is not allowed in global scope, must use a wrapper
// async function main(arg) {

  
// // login
// var smtpTransport = nodemailer.createTransport("SMTP",{
//   service: "Hotmail",
// auth: {
//   xoauth2: xoauth2.createXOAuth2Generator({

//     user: "nadavbranded@hotmail.com",
// pass: "Branded2020"
// })}
// });
//   // create reusable transporter object using the default SMTP transport
//   // let transporter = nodemailer.createTransport({
//   //   host: "smtp.ethereal.email",
//   //   port: 587,
//   //   secure: false, // true for 465, false for other ports
//   //   auth: {
//   //     user: testAccount.user, // generated ethereal user
//   //     pass: testAccount.pass, // generated ethereal password
//   //   },
//   // });
//   var mailOptions = {
//     from: "nadavbranded@hotmail.com", // sender address
//     to: arg, // list of receivers
//     subject: "Hello", // Subject line
//     text: "Hello world", // plaintext body
//     html: "Hello world" // html body
// }
//   // send mail with defined transport object
//   // let info = await smtpTransport.sendMail({
//   //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
//   //   to: arg, // list of receivers
//   //   subject: "Welcome to Breanded", // Subject line
//   //   text: "Congrats on Registering!", // plain text body
//   //   html: "<b>Hello world?</b>", // html body
//   // });


//   // send mail with defined transport object
//   smtpTransport.sendMail(mailOptions, function(error, response){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Message sent: " + response.message);
//     }

//     // if you don't want to use this transport object anymore, uncomment following line
//     smtpTransport.close(); // shut down the connection pool, no more messages
//   });
// }
  module.exports = router;