const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageURL:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, {timestamps: true});

const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');

userSchema.pre('save', function(next) {
    const user= this;
    if(!user.isModified('password')) 
        return;
    const salt= randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');
    //user.salt = salt; 
    //user.password = hashedPassword; 
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

userSchema.static('matchPassword', async function(email, password) {
    const user= await this.findOne({email});
    if(!user)
        throw new Error('Unable to find user');
    const salt= user.salt;
    const hashedPassword = user.password;
    const checkPassword=  createHmac('sha256', salt)
    .update(password)
    .digest('hex');
    if(checkPassword !== hashedPassword)
        throw new Error('Incorrect password');
    const token= createTokenForUser(user);
    return token;
})

const User= model('user', userSchema);
module.exports = User;