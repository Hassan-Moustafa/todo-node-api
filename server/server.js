let {mongoose} = require('./db/mongoose');
let {User} = require('./models/userModel');
let {Todo} = require('./models/todoModel');
let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
let {ObjectID} = require('mongodb');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    let newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        return res.status(200).send({doc});
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        return res.status(200).send({ _todos: todos });
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

app.get('/todos/:id' , (req,res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send({error : 'id is not valid'});
    }

    Todo.findById(id).then((todo) => {
        if(!todo)
        {
            return res.status(400).send({error : 'todo not found'});
        }
        return res.status(200).send({todo});
    }).catch((error) => {
        return res.status(400).send(error);
    })
});

app.patch('/todos/:id' , (req,res) => {
    let id  = req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send({error : 'id is not valid'});
    }

    let body = _.pick(req.body , ['text' , 'completed']);

    Todo.findByIdAndUpdate(id,{
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

app.delete('/todos/:id' , (req,res) => {
    let id  = req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(400).send({error : 'id is not valid'});
    }

    Todo.findByIdAndRemove(id).then((result) => {
        if(!result)
        {
            return res.status(404).send({error : 'id is not found'})
        }
        return res.status(200).send(result);
    }).catch((error) => {
        return res.status(400).send(error);

    })
})

app.listen(3000 , () => {
    console.log('starting server');
})
