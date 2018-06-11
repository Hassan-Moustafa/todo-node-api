let mongoose = require('mongoose');

let Todo = mongoose.model('Todo',{
    text:{
        type: String,
        required: true,
        minlength: 1,
        trim : true
    },
    completed:{
        type: Boolean,
        default: false
    }
});

module.exports = {
    Todo
}