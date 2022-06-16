const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
        trim:true,
    },
    user2:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'user'
    },
    user1:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'user'
    },
},{
    timestamps:true
})

const Message = mongoose.model('message',messageSchema);
module.exports=Message;