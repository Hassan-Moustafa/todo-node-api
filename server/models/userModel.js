let mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
    let token = jwt.sign({_id: user._id.toHexString() , access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access,token}]);

    return user.save().then(() => {
        return token;
    })

}

userSchema.methods.removeToken = function (token){

    let user = this;
    return user.update({
        $pull:{
            tokens:{
                token: token
            }
        }

    })
}

userSchema.statics.findByToken = function (token)
{
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        if(decoded === undefined)
        {
            return Promise.reject();
        }
    }catch(e)
    {
        
        return Promise.reject();
    }

    

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token
    });
}

userSchema.pre('save' , function (next) {
    let user = this;
    if(user.isModified('password'))
    {
        bcrypt.genSalt(10, (error , salt) => {
            bcrypt.hash(user.password , salt , (error , hash) => {
                user.password = hash;
                next();
            })
        })
    }
    else
    {
        next();
    }
});

userSchema.statics.verifyUser = function (userData) {
    
    return new Promise((resolve , reject) => {

        let User = this;
        User.findOne({email : userData.email}).then((user) => {
        
        if(!user)
        {
            return reject({error : 'email or password is incorrect'});  
        }

        bcrypt.compare(userData.password , user.password , (error , result) => {
            if(result)
            {
                return resolve(user);
            }
            return reject({result: false});
        })
    })


    })
    
}

let User = mongoose.model('User',userSchema);

module.exports = {
    User
}