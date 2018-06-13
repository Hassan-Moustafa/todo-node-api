require('./config/config.js');

let {mongoose} = require('./db/mongoose');
let {User} = require('./models/userModel');
let {Todo} = require('./models/todoModel');
let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
let {ObjectID} = require('mongodb');
let {authenticate} = require('./middleware/authenticate');

let app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate ,(req,res) => {
    let newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo.save().then((doc) => {
        return res.status(200).send({doc});
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

app.get('/todos', authenticate , (req,res) => {
    Todo.find({_creator : req.user._id}).then((todos) => {
        return res.status(200).send({ _todos: todos });
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

app.get('/todos/:id' , authenticate, (req,res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send({error : 'id is not valid'});
    }
    
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo)
        {
            return res.status(400).send({error : 'todo not found'});
        }
        return res.status(200).send({todo});
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

app.patch('/todos/:id' , authenticate , (req,res) => {
    let id  = req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send({error : 'id is not valid'});
    }

    let body = _.pick(req.body , ['text' , 'completed']);

    
    Todo.findOneAndUpdate({
        _id : id,
        _creator : req.user._id
    },{
        $set: body
    },
    {
      new: true  
    }).then((todo) => {
        if(!todo)
        {
        return res.status(404).send({error: 'id not found'});
        }
        return res.status(200).send({todo});
    }).catch((error) => {
        return res.status(400).send(error);
    })

});

app.delete('/todos/:id' , authenticate, (req,res) => {
    let id  = req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send({error : 'id is not valid'});
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((result) => {
        if(!result)
        {
            return res.status(404).send({error : 'id is not found'})
        }
        return res.status(200).send(result);
    }).catch((error) => {
        return res.status(400).send(error);

    })
});

app.post('/users' , (req,res) => {
    let body = _.pick(req.body , ['email' , 'password']);
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(newUser);
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.get('/users/me' , authenticate , (req,res) => {
    res.status(200).send(req.user);
});

app.post('/users/login' , (req , res) => {

    let body = _.pick(req.body , ['email' , 'password']);

    User.verifyUser(body).then((user) => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth' , token).send(user);
        })
        
    }).catch((error) => {
        res.send(error);
    })

    
});

app.delete('/users/me/logout' , authenticate , (req,res) => {

        let user = req.user;
        user.removeToken(req.token).then(() => {
            res.status(200).send();
        }).catch((error) => {
            res.status(404).send(error);
        })
})


app.listen(3000 , () => {
    console.log('starting server');
})
