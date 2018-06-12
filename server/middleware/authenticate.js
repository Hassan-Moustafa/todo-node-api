const {User} = require('../models/userModel');

let authenticate = (req,res,next) => {

    console.log('authenticating ... ');
    let token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if(!user)
        {
            return res.status(401).send();
        }
        
        req.user = user;
        req.token = token;
        next();
    }).catch(e => {
        res.status(401).send(e);
    });
};

module.exports = {authenticate};
