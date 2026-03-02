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


}

module.exports = venueModel