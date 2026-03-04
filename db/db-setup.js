const path = require('path')
const {client, connectDB, disconnectDB} = require(path.join(__dirname, 'db.js'))
const fs = require('fs').promises

async function setupDb(){

    try {
        await connectDB()
        await createVenueTable()
        await fillTableVenues()

        await createUserTable()
        await fillUsersTable()
        
        console.log('DB is setup')
        await disconnectDB()
    } catch (err){
        console.log('error when setting up db', err.stack)
    }
}
setupDb();

async function createVenueTable() {
    

    await client.query('DROP TABLE IF EXISTS venues')
    // create table venues

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS venues(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    url VARCHAR(255),
    district VARCHAR(100)
    );`;

    await client.query(createTableQuery);
    
}

async function fillTableVenues() {
    // read file
    // fill table
    const data = JSON.parse(await fs.readFile(path.join(__dirname, 'stores.json'), 'utf-8'));

    const insertQuery = `
    INSERT INTO venues (name, url, district)
    VALUES ($1, $2, $3)
    ;`;
    for (const venue of data){
        const params = [venue.name, venue.url, venue.district];
        try{
            await client.query(insertQuery, params);
        } catch(err){
            console.error(`could not insert row: ${venue}`, err.stack);
        }
    }
}
async function createUserTable(){
    await client.query('DROP TABLE IF EXISTS users')
    //create user table

    const createUserTable = `
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE
    );`;

    await client.query(createUserTable)
    console.log("Users created!")
}
async function fillUsersTable(){
    
        const testUserAdmin = {
            username : 'testadmin',
            password : 'password123',
            email : 'test@example.com',
            isAdmin : true
        }
        const testUserNotAdmin = {
            username: 'defaultuser',
            password : 'password123',
            email : 'test@test.com',
            isAdmin : false
        }
         const insertQuery=`
         INSERT INTO users (username,password,email,isAdmin)
         VALUES($1,$2,$3,$4)
         ON CONFLICT(email) DO NOTHING
         ` 
         try{
            await client.query(insertQuery, [testUserAdmin.username,testUserAdmin.password,testUserAdmin.email,testUserAdmin.isAdmin])
            await client.query(insertQuery,[testUserNotAdmin.username,testUserNotAdmin.password,testUserNotAdmin.email,testUserNotAdmin.isAdmin])
            console.log("testuser created")
         }catch(err){
        console.log(err)
    }
}
