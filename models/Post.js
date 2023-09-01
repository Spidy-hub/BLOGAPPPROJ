const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
        unique:true
    },
    content:{
        type:String,
        required:true
    },
    photo:{
        type:String,  
    },
    name:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    }
});


module.exports = mongoose.model("Post", PostSchema)

