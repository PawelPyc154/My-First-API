const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect Database
connectDB();
// "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
//Init Middleware
app.use(
  express.json({
    extended: false
  })
);

// app.get('/', (req, res) => res.json({
//     msg: 'siemanko Api'
// }));
// Define Routes

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("elo"));
