const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (error , client) =>{
    if(error)
    {
        return  console.log('unable to connect to mongodb server');
    }
    console.log('connection succeeded');
    const db = client.db('TodoAppDB');

    //deleteMany

    // db.collection('Users').deleteMany({name : 'ahmed'}).then((result) => {
    //     console.log(result);
    // })
    //deleteOne

    // db.collection('Users').deleteOne({name : 'ahmed'}).then((result) => {
    //     console.log(result);
    // })

    //findOneAndDelete

    // db.collection('Users').findOneAndDelete({name: 'ahmed'}).then((result) => {
    //     console.log(result);
    // })

    
    client.close();
})