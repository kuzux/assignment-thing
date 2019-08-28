const mongoose = require("mongoose");
module.exports = new mongoose.Schema({
    createdAt: Date,
    counts: [Number]
}, {
    collection: 'records'
});