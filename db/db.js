const { Client } = require('pg');

//change host to project-postgres-container when running node container
const client = new Client({
    //host:'127.0.0.1',
    host:'project-postgres-container',
    port: 5432,
    user: 'postgres',
    password: '12345',
    database: 'postgres'
});

async function connectDB(){
    try {
        await client.connect();
        console.log('Connected to DB')
    }catch(err){
        console.error('Error connecting to DB', err.stack)
    }
}

async function disconnectDB(){
    try {
        await client.end();
        console.log('disconnected from DB')
    }catch(err){
        console.error('Error disconnecting to DB', err.stack)
    }
}


module.exports = {
    client,
    connectDB, 
    disconnectDB
}