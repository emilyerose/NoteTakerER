const app = require('express').Router()
const util = require('util');
const fs = require('fs');
const ShortUniqueId = require('short-unique-id');



app.get('/notes', (req,res) =>{
    //get all notes
    // const db = util.promisify(fs.readFile('../db/db.json'))
    // db.then((data) => res.json(JSON.parse(data)))
    // .catch((err)=> console.error(err))

    fs.readFile('./db/db.json','utf-8',(err,data) =>{
        if(err) {
            console.error(err)
        }
        else{
            res.json(JSON.parse(data))
        }
    })
})

app.post('/notes', (req,res) => {
    //receive a new note to save on the request body
    if (req.body) {
        const {title, text} = req.body
        const uid = new ShortUniqueId({ length: 10 });
        const newNote = {
            title: title,
            text: text,
            id: uid()
        }
        //add it to the db.json file
        fs.readFile('./db/db.json','utf-8',(err,data) => {
            if(err) { console.error(err) }
            else {
                const notesArr = JSON.parse(data);
                notesArr.push(newNote)
                fs.writeFile('./db/db.json',JSON.stringify(notesArr,null,'\t'),(err) =>
                err ? console.error(err) : console.info(`\nData written to databse`))
                //return new note to client
                res.json(newNote);
            }
        })
    }
    else{
        console.error('Error adding note')
    }
})


module.exports= app;