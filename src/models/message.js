const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
        trim:true,
    },
    receiver:{
        type :String,
        required : true,
        ref:'user'
    },
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'user'
    },
},{
    timestamps:true
})

const Message = mongoose.model('message',messageSchema);
module.exports=Message;