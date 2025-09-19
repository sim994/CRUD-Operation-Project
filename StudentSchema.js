const mongoose = require("mongoose");
const { MAX } = require("uuid");



const chatSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require,
    },
    age:{
        type:Number,
        require,
    },
    address:{
        type:String,
        require,
        maxlength:40
    },
    grades:{
        type:String,
        require,
    
    },
    TotalMarks:{ 
        type:Number,
        require
    }

  
});

const StudentData = mongoose.model("StudentData",chatSchema)
module.exports = StudentData
