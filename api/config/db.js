const mongodb = require('mongodb');
const uri = "mongodb+srv://manish:Marcus24@marcus.aovmukv.mongodb.net/?retryWrites=true&w=majority";
const db = "Marcus"

const client = new mongodb.MongoClient(uri);

module.exports = {
    connect: () => {
        // Connect to MongoDB
        client.connect()
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch(err => {
                console.error('Failed to connect to MongoDB', err);
            });
    },
    client
};