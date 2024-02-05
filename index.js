const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
// --------------------------------------
// middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --------------------------------------
// create  product schema

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
// -----------------------------------
// create  product model

const Product = mongoose.model('product', productsSchema)
// -----------------------------------

// MongooseDB connection 
const connectDB = async () => {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testProductDB')
        console.log('db is connect')
    } catch (error) {
        console.log('db is not connect')
        console.log(error.message);
        process.exit(1)
    }


}

// --------------------------------
// get data 
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// post data create data

app.post('/products', async (req, res) => {
    try {

        // get data from request body 
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const newProduct = new Product({
            title: title,
            price: price,
            description: description
        })
        const productData = await newProduct.save()
        // res.send('post!')
        res.status(201).send(productData)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


// post many -------------------

app.post('/products', async (req, res) => {
    try {
        const productData = await Product.insertMany([
            {
                title: "nokia",
                price: 5000,
                description: "this is a nice phone"
            },
            {
                title: "apple",
                price: 15000,
                description: "this is a nice phone"
            },
        ])
        // res.send('post!')
        res.status(201).send(productData)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// get all data 
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find().sort().select({ title: 1 })
        if (products) {
            res.status(200).send(res.status(200).send({ success: true, message: "return all products", data: products }))
        }
        else {
            res.status(404).send({ success: false, message: "products not found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// get  data  by id
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id
        const products = await Product.findOne({ _id: id })
        if (products) {
            res.status(200).send({ success: true, message: "return single product", data: products })
        }
        else {
            res.status(404).send({ success: false, message: "products not found" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})
// get  data  by id select 
// app.get("/products/:id", async (req, res) => {
//     try {
//         const id = req.params.id
//         const products = await Product.findOne({ _id: id }).select({ title: 1, price: 1, _id: 0 })
//         res.send(products)
//         if (products) {
//             res.status(200).send(products)
//         }
//         else {
//             res.status(404).send({ message: "products not found" })
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message })
//     }
// })












app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    await connectDB()
})



// basic
// const loadRegister = async (req, res) => {
//     try {
//         res.status(201).send(productData)
//     } catch (error) {
//         res.status(500).send({ message: error.message })
//     }
// }


// DATABASE--> collection (table)--> document

// POST: /products --> create a product
// GET: /products --> Return all the product
// GET: /products/:id --> Return  the product by id
// PUT: /products/:id --> update a product by id
// DELETE: /products/:id --> delete a product by id