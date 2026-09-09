// const dns = require("dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// require('dotenv').config()

// const express = require('express');
// const dbCon = require('./config/dbCon');
// const app = express()
// const cors = require('cors')

// dbCon()

// app.use(cors({
//     origin: "http://localhost:3000"
// }))

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))


// const router = require('./router/index')
// app.use(router)

// const PORT = process.env.PORT || 3007;
// app.listen(PORT, ()=>{
//     console.log(`app is listening on PORT ${PORT}`)
// })



const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router/index")

const allowedOrigins = [
  process.env.LOCAL_FRONTEND_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

module.exports = app;
