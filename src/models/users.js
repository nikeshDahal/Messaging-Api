const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//schema need properties so we passed objects having certain properties in to it.
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        unique:true,
        required : true,
        trim : true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type : String,
        required : true,
        minLength : 4,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('input text other than password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
});

//.....................abstraction of the details which is to be rendered to client .................//
userSchema.methods.toJSON=function(){
    const user = this
    const userObj = user.toObject();
    delete userObj.password
    delete userObj.tokens
    return userObj;
}

//.......................to generate jwt tockens......................//
userSchema.methods.generateAuthToken=async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'SECRET_KEY');
    user.tokens = user.tokens.concat({ token })
    user.save();
    return token; 
}


//...................to find the users....................................//

userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({
        email:email
    });
    if(!user){
        throw new Error('user not found !! unable to login')
    }
    const isMatched =await  bcrypt.compare(password,user.password);
    if(!isMatched){
        throw new Error('password not matched')
    }
    return user;  
}

//............................hashing the password............................//

userSchema.pre('save',async function(next){
    console.log('password is hashed before it is saved in to database.....');
    const user=  this;//gives the user obj which is defined in user schema
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,10);  
    }
    next();
});

const User = mongoose.model('user',userSchema);
module.exports=User;