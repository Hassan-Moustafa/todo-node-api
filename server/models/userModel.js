let mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
/*
    {
        email: 'hassanmoustafa40@yahoo.com',
        password: 'sasaasa456', must be hashed
        token: [
            {
                access: 'auth',
                token: 'asasdasdadasdadasdasda'

            }
        ]
    }

*/ 

let userSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
        minlength:1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not valid'
        }
    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required: true
        },
        token:{
            type:String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'Auth';
    let token = jwt.sign({_id: user._id.toHexString() , access},'abc123').toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() => {
        return token;
    })

}
let User = mongoose.model('User',userSchema);

module.exports = {
    User
}