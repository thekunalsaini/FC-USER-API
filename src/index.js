const express = require("express");
const app = express();

const userRouter = require("./routes/userRoutes"); 
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use(cors());

app.use("/users", userRouter);
var corsOptions = {
    origin: 'http://localhost:5003',
    optionsSuccessStatus: 200 // For legacy browser support
}


app.get("/", (req, res) =>{
    res.send("Test API");
});

const PORT = process.env.PORT;
//const PORT = 5001;

mongoose.connect(process.env.Cluster_URL,{
    // minPoolSize:1,
       maxPoolSize:10 // max pool means more throughput
})
//mongoose.connect("mongodb://127.0.0.1/userDB")
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server started on port no. " + PORT);
    });
})
.catch((error)=>{
    console.log(error);
})


