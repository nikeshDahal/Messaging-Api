require('dotenv').config();
const express = require ("express");
const app = express();
const port = process.env.PORT;


require("./db/mongoose"); //for db connection

const usersRouter = require('./routers/usersRouter');
const messageRouter = require('./routers/messageRouter');
app.use(express.json());
app.use(usersRouter);
app.use(messageRouter);






app.listen(port,()=>{
    console.log("server is running on port: "+ port)
})


