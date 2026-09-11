require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/img', express.static(__dirname + '/public/images'))

const postagensRoutes = require('./routes/postagens')
app.use('/', postagensRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))