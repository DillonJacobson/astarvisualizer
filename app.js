const express = require('express')
const path = require('path')
const dotenv = require('dotenv')

//Extract command line arguments
const processArgs = process.argv.slice(2)
var cmdArgs = {}
processArgs.forEach((arg) => {
    if (arg.slice(0,2) == '--'){
        arg = arg.split('=')
        //Replace - with _ in arg names and capitalize
        let argName = arg[0].slice(2).replace('-', '_').toUpperCase()
        cmdArgs[argName] = arg[1]
    }
})

const ENV_FILE = cmdArgs.ENV_FILE || '.env'
const ENV_OVERRIDE = cmdArgs.ENV_OVERRIDE || false
const ENV_DEBUG = cmdArgs.ENV_DEBUG || false

dotenv.config({
    "path": ENV_FILE,
    "override": ENV_OVERRIDE,
    "debug": ENV_DEBUG
})

const app = express()
const PORT = cmdArgs.PORT ? cmdArgs.PORT : process.env.PORT || 3000
const HOST = cmdArgs.HOST ? cmdArgs.HOST : process.env.HOST || 'localhost'

app.use(express.static(path.join(__dirname,'assets')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(PORT, HOST, () => {
    console.log(`App has started on ${HOST}:${PORT}...`)
})



