// här ska CRUD för venue finnas
//philip
const {client} = require('./db');
    //skapar sql querys, felhantering
const venueModel = {
    getAllVenues: async function(){
        try{
            const res = await client.query('SELECT * FROM venues;');
            return res.rows;
        }catch(err){
            console.error('Error in getAllVenues', err.stack);
            throw err;
        }
        
    },

    getLinks: async function(){
        try{
            const res = await client.query('SELECT url FROM venues WHERE url IS NOT NULL')
            return res.rows
        }catch(err){
            console.error('Error in getting links', err.stack)
            throw err
        }
    },
    getAllStoreNames : async function(){
        try{
            const res = await client.query('SELECT name FROM venues')
            return res.rows
        }catch(err){
            console.log(err)
            throw err
        }
    },
    createVenue : async function(name,url,district){
        try{
            const query = 'INSERT INTO venues (name,url,district) VALUES($1,$2,$3)'
            const res = await client.query(query,[name,url,district])
            return res.rows
        }catch(err){
            console.error("error in createvenue", err.stack)
            throw err
        }
    }


}

module.exports = venueModel