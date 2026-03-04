const express = require('express');
const app = express();
const {connectDB} = require('./db/db');
const venueModel = require('./db/venueModel');
const usersModel = require('./db/usersModel')

//cookies
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const SECRET = 'YouWillNeverGuessThis'; //change this in production (not that it will be)!!!!!!!!!!

const sessions = {};
app.use(cookieParser(SECRET));
//arvid
//routes mellan client och server genom venue functioner.
const PORT = 8080

app.use('/', express.static('public'));


app.get('/api/venues', async (req,res) => {
    try{
        const venues = await venueModel.getAllVenues();
        res.status(200).json(venues);
    }catch(err){
        res.status(500).json({message: 'could not get venues', error: err});
    }
})

app.post('/api/venues/new', express.json(), async (req,res) => {
    try{
        const {name, url, district} = req.body;
        const results = await venueModel.createVenue(name, url, district)
        res.status(200).json({message: 'succesfully posted', results})
    }
    catch(err) {
        res.status(500).json({message: 'could not post venue',error: err})
    }
})

app.put('/api/venues/:id', express.json(), async (req, res) => {
    try{
        const venueId = req.params.id;
        const { name, url, district} = req.body;
        const results = await venueModel.updateVenue(venueId, name, url, district)
        res.status(200).json({message: 'succesfully updated', results})
    } catch(err){
        res.status(500).json({message: 'could not update venue', error: err})
    }
})

app.delete('/api/venues/:id', express.json(), async (req,res) => {
    try {
        const venueId = req.params.id;
        const result = await venueModel.deleteVenue(venueId)
        res.status(200).json({message: 'succesfully deleted', result})
    } 
    catch(err) {
        res.status(500).json({message: 'could not delete venue', error: err})
    }
})

app.get('api/users', async (req,res) => {
    try{
        const users = await usersModel.getAllUsers();
        res.status(200).json(users)
    } catch(err){
        res.status(500).json({message: 'Could not get users', error: err})
    }
})
app.get('api/user/:name', express.json(), async (req,res) => {
    try{
        const name = req.params.name
        const user = await usersModel.getUser(name)
        res.status(200).json(users)
    }catch(err) {
        res.status(500).json({message: 'Could not get user', error: err})
    }
})

app.post('api/login', express.json(), async(req,res) =>{
    try{
        const { username, password } = req.body;

        const user = await usersModel.getUser(username)
        if (user && password === user.password){

            const token = crypto.randomBytes(64).toString('hex');
            sessions[token] = { user: user.username, isAdmin: user.isAdmin };
            return res
            .cookie('authToken', token, { signed: true, httpOnly: true })
            .json({user:{username: user.username, isAdmin: user.isAdmin}});
        }
        res.status(401).json({message: 'Invalid username or password'})

    } catch(err){
        res.status(500).json({message: 'Could not log in', error: err})
    }
})


/*
//test to see only links
app.get('/api/venues/links', async(req,res)=>{
    try{
        const venues = await venueModel.getLinks(req.query.url)
        res.json(venues)
    }catch(err){
        console.log(err)
    }
})
//test to see mockuser
app.get('/api/users', async (req,res)=>{
    try{
        const users = await usersModel.getAllUsers()
        res.json(users)
    }catch(err){
        console.log(err)
    }
})
//to get all the store names.
app.get('/api/storeNames', async (req,res) => {
    try{
        const stores = await venueModel.getAllStoreNames()
        res.json(stores)
    }catch(err){
        console.log(err)
    }
})
app.get('/api/users/:name', async (req, res) => {
    try {
        const user = await usersModel.getUser(req.params.name);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})*/
const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}...`)
    })
}
startServer();
