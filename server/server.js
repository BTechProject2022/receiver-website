const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const bcrypt = require("bcryptjs");
const socketIo = require("socket.io");

const myEmitter = require("./config/emitter");
const users = require("./routes/users");
const did = require("./routes/did");
const credential = require("./routes/credential");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());

//to create admin
const User = require("./models/UserModel");
const Cred = require("./models/CredModel");
const { EventEmitter } = require("stream");

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const dbURL = "mongodb://localhost:27017/receiver-db";

//connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || dbURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    User.findOne({ email: "admin@admin.com" }).then((user) => {
      if (!user) {
        const admin = new User({
          name: "admin",
          password: "admin",
          email: "admin@admin.com",
          studentId: Math.floor(Math.random() * 10000 + 1) + "",
          isAdmin: true,
        });

        // Hash password before storing in database
        const rounds = 10;
        bcrypt.genSalt(rounds, (err, salt) => {
          bcrypt.hash(admin.password, salt, (err, hash) => {
            if (err) throw err;
            admin.password = hash;
            admin.save().catch((err) => console.log(err));
          });
        });
      }
    });
    console.log("Admin Details, email : admin@admin.com , password : admin");
    console.log("MongoDB successfully connected");
  })
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/did", did);
app.use("/api/credential", credential);

//
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT;

const temp = app.listen(port, process.env.LOCAL_IP, () =>
  console.log(`Server up and running on port ${port}`)
);

//for socket io
const io = socketIo(temp, {
  cors: {
    methods: ["GET", "POST"], // add the methods you want to allow
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connection made");
  socket.on("checkUpdate", (userEmail) => {
    let receiveCall = "receive" + userEmail;
    let updateCall = "update" + userEmail;
    myEmitter.on(receiveCall, (data) => {
      socket.emit("credentialAdded");
    });
    myEmitter.on(updateCall, (data) => {
      socket.emit("credentialUpdated");
    });
  });
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});
