require("dotenv").config();

const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose")

const urlShorterRouter = require("./routes/cut");
const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const HOST_NAME = process.env.HOST_NAME; 


app.use(cors({
    origin: HOST_NAME,
    methods: ["POST", "GET","DELETE"],
    credentials: true
}));
app.use(express.json());
app.use("/api/cut", urlShorterRouter);

mongoose.connect(DB_URI)
    .then(()=>{
        console.log("mongo db connected")
    })
    .catch((err)=>{
        console.error(`mongo db connected with error:${err.message}`)
    });



app.listen(PORT, ()=> {
    console.log(`Shortly url server is started on port:${PORT}`)
})