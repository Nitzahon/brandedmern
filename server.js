const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const users = require("./routes/api/users");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;


mongoose
  .connect(db || "mongodb://localhost/mern_branded", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));
// mongoose.connection.on('connected', ()=>{
// console.log('Mongoose is connected!!!');
// });

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes

app.use("/api/users", users);
const port = process.env.PORT || 8080;
//HTTP request logger
app.use(morgan("tiny"));

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
