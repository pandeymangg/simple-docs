const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("Home Page")
})

app.listen(8000, () => {
    console.log("server started at port: 8000")
})