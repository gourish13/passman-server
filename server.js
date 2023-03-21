require('dotenv').config();

const express = require('express');
const app = express();

// Global Middlewares
app.use(require('cors')());
app.use(require('morgan')('tiny'));
app.use(express.json());

require("./models/mongo");

// Auth Routes
app.use("/auth", require("./routes/auth"));
// Api Routes
app.use("/api/v1", require("./routes/api"));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, err => {
    if (err) console.log(err);
    console.log(`[ 🔥 SERVER ] PORT: ${PORT}`)
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('\n 🛑 Shuting Down Server......');

        process.exit();
    });
});
