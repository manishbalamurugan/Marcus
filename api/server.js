const cors = require('cors');
const functions = require('firebase-functions');
const express = require('express');
const routes = require('./routes/chat');
const db = require('./config/db');

// Express + MongoDB Setup
const app = express();
const port = process.env.PORT || 4200;


app.use(cors());
app.use(express.json());
app.use(express.json());

// Connect to MongoDB
db.connect();

// Routes
app.use('/api', routes);

// app.listen(3030, () => {
//   console.log('Server running on port 3030');
// });

exports.app = functions.https.onRequest(app);