const express= require("express");
const dotenv = require("dotenv");
const db = require("./db/database");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const { notFound, errorhandler } = require("./middleware/error");


dotenv.config();
const app = express();
const cors= require('cors');
app.use(cors());

db();
//to accept json file
app.use(express.json());

//---> error handler code<----//
app.use(notFound);
app.use(errorhandler);


app.use('/',userRoute);
app.use('/chat',chatRoute);

app.listen(5000,console.log("server"));