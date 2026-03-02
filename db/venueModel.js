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
            const query = 'INSERT INTO venues (name,url,district) VALUES($1,$2,$3) RETURNING*'
            const res = await client.query(query,[name,url,district])
            //only return the added data
            return res.rows[0]
        }catch(err){
            console.error("error in createvenue", err.stack)
            throw err
        }
    },
    updateVenue : async function(id,name,url,district){
        try{
            const query = 'UPDATE venues SET NAME = $1, url = $2, district=$3 WHERE id = $4 RETURNING*'
            const res = await client.query(query,[name,url,district,id])
            //only return the eccential data, not all. This case the updated one
            return res.rows[0]
        }catch(err){
            console.error("Error in updatevenue ",err.stack)
            throw err
        }
    },
    deleteVenue : async function(id){
        try{
            const query = 'DELETE FROM venues WHERE id = $1'
            const res = await client.query(query,[id])
            //return if rows affected is greater than 0
            return res.rowCount>0
        }catch(err){
            console.error("Error in deleting " , err.stack)
        }
    }
}

module.exports = venueModel