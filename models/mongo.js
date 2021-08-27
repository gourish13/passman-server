const mongoose = require('mongoose');

const dbUri = process.env.DBURI;

mongoose.connect(dbUri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then( result => console.log('[ 🍀 MONGO DB ] Connected') )
    .catch(console.log);
