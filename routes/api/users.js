const app = require("express");
const router = app.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");
require("dotenv").config();
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");


router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        dateofbirth: req.body.dateofbirth,
        confirmed: false,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
      process.env.mailServer = JSON.stringify({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: { user: "e2099db76ea72a", pass: "1b32b6e934201e" },
      });
      //Send Mail
      var transport = nodemailer.createTransport(
        //Mailtrap works, if you want to test mails then use your own credentials or contact author for Mailtrap access
        JSON.parse(process.env.mailServer)
      );
      const message = {
        from: "nadavga@gmail.com", // Sender address
        to: newUser.email, // List of recipients, also make sure the mail is sent
        subject: "Welcome to Branded", // Subject line
        text: "Welcome to the site!", // Plain text body
      };
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
    }
  });
});
// // Retrieve all Users
//, { session: false }
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //passport makes it private

    User.find({}, { _id: 1, email: 1, dateofbirth: 1, name: 1 }, function (
      err,
      users
    ) {
      if (err) {
        res.send("something went wrong");
        next;
      }

      res.json(users);
    });
  }
);
// @route GET api/users/currentuser
// @desc Return current user
// @access Private
router.get(
  "/currentuser",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
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
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // if(!user.confirmed){
    //   return res.status(404).json({ email: "Email has not been confirmed, please confirm to log in" });
    // }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
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

module.exports = router;
// expermints with authentication emails
// ------------------
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
// -------------
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
//----------------
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
//--
