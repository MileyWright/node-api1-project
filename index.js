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
        // If the request body is missing the "name" or "bio" property respond with status code 400 (Bad Request)
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

//GET Returns the user object with specified id
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then( user => {
            if(!id){
                res.status(404).json({
                    errorMessage: "The user with the specified ID does not exist."
                })
            } else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                errorMessage: "The user information could not be retrieved"
            })
        })
})

// DELETE Removes the user with the specified id and returns the deleted user
server.delete('/api/user/:id', (req,res) =>{
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if(!id){
                res.status(404).json({
                    Message:"The user with the specified ID does not exist"
                })
            } else {
                db.remove(id)
                    .then(deleted => {
                        res.status(200).json(deleted)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({
                            errorMessage: "The user could not be removed"
                        })
                    })
            }
        })
        
})

// PUT Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.