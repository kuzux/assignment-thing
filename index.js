// initially intended to use plain mongo node driver, mongoose is a bit heavy for this kind of an
// application. Ended up being unable to get the query string to work and started depending on mongoose
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();
app.use(bodyParser.json());

// not sure how to stub this out for testing, but there should be a way.
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
    // this query is unnecessarily complicated, IMO. Looks just like a broken way to write some sql
    // the query included for comparison.
    // select id, createdAt, sum(counts) as totalCounts from records 
    //        group by _id 
    //        having sum(counts) between minValue and maxValue
    //        where createdAt between startDate and endDate;
    const recs = Record.aggregate([
        { $match: {
            // this was probably my biggest hurdle in all of this, the aggregate query was easy,
            // this one just didn't seem to work at all no matter what I try
            createdAt: {
                $gt: new Date(`${req.body.startDate}T00:00:00.000Z`),
                $lt: new Date(`${req.body.endDate}T23:59:59.999Z`)
            }
        }},
        { $addFields: {
            totalCount: {$sum: "$counts"}
        }},
        { $project: {
            _id: 1,
            createdAt: 1,
            totalCount: 1
        }},
        { $match: {
            totalCount: {
                $lt: req.body.maxCount,
                $gt: req.body.minCount
            }
        }}
    ]);
    recs.exec((err, docs) => {
        if(err) {
            console.log(`query error: ${err}`);
            res.send({
                code: 1,
                msg: `query error: ${err}`
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
