const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (error , client) =>{
    if(error)
    {
        return  console.log('unable to connect to mongodb server');
    }
    console.log('connection succeeded');
    const db = client.db('TodoAppDB');
    // db.collection('Todos').insertOne({
    //     name: 'buy pepsi',
    //     completed: false
    // },(error,result) => {
    //     if(error)
    //     {
    //         return console.log('can not insert data');
    //     }
    //     console.log(result.ops);
    // })

    db.collection('Users').insertOne({
        name: 'hassan',
        age: 24,
        location: 'cairo'
    },(error , result) => {
        if(error)
        {
            return console.log('can not insert data');
        }
        console.log(result.ops[0]);
        console.log(result.ops[0]._id.getTimestamp());
    })

    
    client.close();
})