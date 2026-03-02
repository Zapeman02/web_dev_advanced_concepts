const express = require('express');
const app = express();
const {connectDB} = require('./db/db');
const venueModel = require('./db/venueModel');
const usersModel = require('./db/usersModel')
//arvid
//routes mellan client och server genom venue functioner.
const PORT = 8080

app.use('/', express.static('public'));


app.get('/api/venues', async (req,res) => {
    try{
        const venues = await venueModel.getAllVenues();
        res.json(venues);
    }catch(err){
        res.status(500).json({message: 'could not get venues', error: err});
    }
})
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

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}...`)
    })
}
startServer();
