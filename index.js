process.env = require("./env.json");

const express  = require("express");
const app = express();

//db
const mongoose = require("./configs/db");
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
// app.use(cors());

app.use(require("./routes/users"));



app.listen(process.env.server.port, ()=>{
    console.log(`Listening on port ${process.env.server.port}`);
});