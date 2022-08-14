const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname,'assets')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(PORT, () => {
    console.log('App has started...')
    console.log(`Serving static files at ${path.join(__dirname,'assets')}`)
})



