// här ska CRUD för venue finnas

const {client} = require('./db');

const venueModel = {
    getAllVenues: async function(){
        try{
            const res = await client.query('SELECT * FROM venues;');
            return res.rows;
        }catch(err){
            console.error('Error in getAllVenues', err.stack);
            throw err;
        }
        
    }
}

module.exports = venueModel