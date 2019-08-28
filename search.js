const search = (model, data, cb) => {
    // checking for illegal conditions
    if(data.minCount > data.maxCount) {
        cb("minCount can't be greater than max count");
        return;
    }
    const startDate = new Date(`${data.startDate}T00:00:00.000Z`);
    const endDate =  new Date(`${data.endDate}T23:59:59.999Z`);
    if(startDate > endDate) {
        cb("start date can't be greater than end date");
        return;
    }
    // this query is unnecessarily complicated, IMO. Looks just like a broken way to write some sql
    // the query included for comparison.
    // select id, createdAt, sum(counts) as totalCounts from records 
    //        group by _id 
    //        having sum(counts) between minValue and maxValue
    //        where createdAt between startDate and endDate;
    const recs = model.aggregate([
        { $match: {
            // this was probably my biggest hurdle in all of this, the aggregate query was easy,
            // this one just didn't seem to work at all no matter what I try
            createdAt: {
                $gt: startDate,
                $lt: endDate
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
                $gt: data.minCount,
                $lt: data.maxCount
            }
        }}
    ]);

    recs.exec(cb);
};

module.exports = search;