const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

// bcrypt.genSalt(10,(error , salt) => {
//     bcrypt.hash(password , salt , (error , hash) => {
//         console.log(hash);
//     })
// });

// let hashedVal = '$2a$10$OF0aqPxFUGElARWaNNnF0.PKCg/RuGyV/P.sEKl7XmSchEs6Pug.G';

// bcrypt.compare('123abc!' , hashedVal,(error , res) => {
//     console.log(res);
// });



// let data = {
//     id: 10
// }

// let token = jwt.sign(data,'123');
// console.log(token);

// let decoded = jwt.verify(token , '123');
// console.log(decoded);




// let message = 'i am user number 3';
// let hash = SHA256(message).toString();
// console.log(hash);

// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'aaa').toString()
// }

// var hashResult = SHA256(JSON.stringify(token.data) + 'aaa').toString();

// if(hashResult === token.hash)
// {
//     console.log('data is correct');
// }
// else{
//     console.log('some one changed the data');
// }