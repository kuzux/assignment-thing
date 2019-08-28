// initially intended to use plain mongo node driver, mongoose is a bit heavy for this kind of an
// application. Ended up being unable to get the query string to work and started depending on mongoose
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const search = require("./search");
const schema = require("./schema");

const port = 3000;
const app = express();
app.use(bodyParser.json());

// not sure how to stub this out for testing, but there should be a way.
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
const db = mongoose.connection;
// handling db connection errors
db.on('error', (err) => { console.log(`connection error: ${err}`); });
db.once('open', () => { console.log("connected to db"); });

const Record = mongoose.model('Record', schema);

app.post('/filter', (req, res) => {
    search(Record, req.body, (err, docs) => {
        if(err) {
            // maybe do better logging later on?
            console.log(`query error: ${err}`);
            res.send({
                code: 1,
                msg: `error: ${err}`
            });
        } else {
            res.send({
                code: 0,
                msg: 'Success',
                records: docs
            });
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
