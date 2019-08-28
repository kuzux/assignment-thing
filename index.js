const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const express = require("express");

const port = 3000;
const app = express();

app.post('/filter', (req, res) => {
    res.send('hello!')
});

MongoClient.connect(process.env.DB_URL, { useNewUrlParser: true,useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    console.log(client.topology.clientInfo);
    app.listen(port, () => console.log(`Listening on port ${port}!`))

    client.close();
});
