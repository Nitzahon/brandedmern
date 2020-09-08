const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const users = require("./routes/api/users");

// require('dotenv').config({path: __dirname + '/.env'});
require('dotenv').config();

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// DB Config


const db = process.env.mongoURI;



mongoose
  .connect(db || "mongodb://localhost/mern_branded", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));


app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes

app.use("/api/users", users);
const port = process.env.PORT || 5000;
//HTTP request logger
app.use(morgan("tiny"));

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
