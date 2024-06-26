import express from 'express'
import {PORT, mongoDbUrl} from './config.js'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"

const app = express()
app.use(express.json())





const client = new MongoClient(mongoDbUrl,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const booksDB = client.db("myBookShop")
const myBooks = booksDB.collection("booksCollection")

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`)
})


app.get('/', (req, res)=>{
    
    return res.status(202).send({response:"Welcome to the bookshop!"})
})

app.get('/shop', (req, res)=>{
    //route show all books
    
    myBooks.find().toArray()
    .then(response=>{
        //console.log(response)
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))

    //return res.status(202).send("<h1>Hello shop!</h1>")
})

app.get('/shop/:id', (req, res)=>{
    // route show a specific book
    const data = req.params
    const filter = {
        "_id" : new ObjectId(data.id) 
    }
    myBooks.findOne(filter)
    .then(response=>{
        console.log(response)
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))
    // return res.status(202).send(`<a href='/'> Book: ${data.id}</a>`)
})

app.post('/admin/savebook', (req, res)=>{
    //route adds a new book
    const data = req.body

    if (!data.title)
        return res.status(400).send("No title found")

    if (!data.author)
        return res.status(400).send("No author found")

    if (!data.price)
        return res.status(400).send("No price found")

    myBooks.insertOne(data)
    .then(response=>{
        return res.status(201).send(JSON.stringify(response))
    })
    .catch(err=>console.log(err))
})

app.delete('/admin/remove/:id', (req, res)=>{
    const data = req.params

    const filter = {
        "_id" : new ObjectId(data.id) 
    }
    myBooks.deleteOne(filter)
    .then(response=>{
        console.log(response)
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))

})

app.put('/admin/update/:id/', (req, res)=>{
    const data = req.params
    const docData = req.body
    const filter = {
        "_id" : new ObjectId(data.id)
    }

    const upDoc = {
        $set: {
            //"price" : data.price
            ...docData
        }
    }

    myBooks.updateOne(filter, upDoc)
    .then(response =>{
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))

})