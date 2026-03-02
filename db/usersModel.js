const {client} = require('./db');

const usersModel = {
    getAllUsers : async function(){
        try{
            const res = await client.query('SELECT * FROM users')
            return res.rows
        }catch(err){
            console.log(err)
            throw err
        }
    },
    getUser : async function(name){
        try{
            const res = await client.query('SELECT * FROM users WHERE username = $1',[name])
            return res.rows
        }catch(err){
            console.log(err)
            throw err
        }
    }
}
module.exports = usersModel