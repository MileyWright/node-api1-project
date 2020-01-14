// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server=express();
server.use(express.json());

server.listen(5000, () => 
    console.log('API running on port 5000')
);

//POST Creates a user using the information sent inside the request body
server.post('/api/users', ( req, res) => {
    const dbData = req.body;
    db.insert(dbData)
    .then( user => {
        if(req.body.name === "" || req.body.bio === ''){
            res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        }
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({
            errorMessage: "There was an error while saving the user to the database"
        })
    })
})

// GET Returns an array of all the user objects contained in db
server.get('/api/users', ( req, res) => {
    db.find()
    .then( user => {
        res.status(200).json(user);
    })
    .catch(err => {
        console.log("error on GET /api/users",err);
        res.status(500)
            .json({ errorMessage: "error getting the data"})
    });
});