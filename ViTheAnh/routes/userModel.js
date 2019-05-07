const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = new Schema({
    user : {
        type : String,
        required : true
    },
    contact:{
        type : String,
        required : true
    },
    email:{
        type: String,
        required : true
    },
    adress:{
        type: String,
        required : true
    },
    password:{
        type : String,
        required :true
    },
    buy : {
        type : [{id : String , price : Number}],
        require : false
    },
    vip :{
        type : Boolean,
        require : true,
        default : false
    },
    createdAt :{
        type : Date,
        required : true,
        default : new Date().toUTCString()
    },
    verify :{
        type : Boolean,
        required : true,
        default : false
    },
    permissions : [String]
})
const User = mongoose.model('costumer', typeSchema);
module.exports = User ;
