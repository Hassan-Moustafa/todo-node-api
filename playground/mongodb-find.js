const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (error , client) =>{
    if(error)
    {
        return  console.log('unable to connect to mongodb server');
    }
    console.log('connection succeeded');
    const db = client.db('TodoAppDB');

    // db.collection('Todos').find().toArray().then((docs) => {
    //     console.log('docs');
    //     console.log(JSON.stringify(docs,undefined,2));
    // })

    db.collection('Todos').find({completed: true}).toArray().then((docs) => {
        console.log('docs');
        console.log(JSON.stringify(docs,undefined,2));
    })

    
    client.close();
})