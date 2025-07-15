const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required :true,
    },
    questionText:{
        type:String,
        required:true
    },
    aiHint:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Question',questionSchema);