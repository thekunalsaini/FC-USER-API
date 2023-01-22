const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const UserSchema = mongoose.Schema({

    username : {
        type : String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    secure_word : {
        type : String,
        required: true
    },
    amount : {
        type : Number,
        required: true
    },
    DOB : {
        type : String,
        required: true
    },
    upi : {
        type : String,
        required: true
    },
    gender : {
        type : String,
        required: true
    },
    address : {
        type : String,
        required: true
    },
    acard : {
        type : Number,
        required: true
    },
    key1 : {
        type : String,
        required: true
    },
    key2 : {
        type : String,
        required: true
    },
    key3 : {
        type : String,
        required: true
    },

}, {timestamps : true});

module.exports = mongoose.model("User", UserSchema);