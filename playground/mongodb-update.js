const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (error , client) =>{
    if(error)
    {
        return  console.log('unable to connect to mongodb server');
    }
    console.log('connection succeeded');
    const db = client.db('TodoAppDB');

    db.collection('Users').findOneAndUpdate({
        name: 'hassan'
    },
    {
        $set:{
            age: 27,
            location: 'CAIRO'
        }
    },
    {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
    
    client.close();
})