require('dotenv').config();

const express = require('express');
const app = express();

app.use(require('cors')());
app.use(require('morgan')('tiny'));
app.use(express.json());

const mongoConnect = require('./models/mongo');

// Auth Routes
app.use('/auth', require('./routes/auth'));
// Api Routes
app.use('/api/v1', require('./routes/api'));

const PORT = process.env.PORT || 3000

app.listen(PORT, err => {
    if (err) console.log(err);
    console.log('[ 🔥 SERVER ] PORT:', PORT)
})
