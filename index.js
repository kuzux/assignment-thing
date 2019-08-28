const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => { console.log(`connection error: ${err}`); });
db.once('open', () => { console.log("connected to db"); });

const schema = new mongoose.Schema({
    createdAt: Date,
    counts: [Number]
}, {
    collection: 'records'
});
const Record = mongoose.model('Record', schema);

app.post('/filter', (req, res) => {
    console.log(req.body);
    const recs = Record.find({
    });
    recs.exec((err, docs) => {
        if(err) {
            console.log(`query error: ${err}`);
            res.sendStatus(500);
        } else {
            res.send(docs);
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
