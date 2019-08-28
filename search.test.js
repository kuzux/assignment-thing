const search = require("./search");
const schema = require("./schema");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose").default;

test("no data", () => {
    search(null, {}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("no count", () => {
    search(null, {startDate: '2018-01-01', endDate: '2019-01-01'}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("no date", () => {
    search(null, {minCount: 3, maxCount: 5}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("mindate > maxdate", () => {
    search(null, {minCount: 3, maxCount: 5, endDate: '2018-01-01', startDate: '2019-01-01'}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("mincount > maxcount", () => {
    search(null, {maxCount: 3, minCount: 5, startDate: '2018-01-01', endDate: '2019-01-01'}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("invalid date", () => {
    search(null, {minCount: 3, maxCount: 5, startDate: '2018-01-xd', endDate: '2019-01-yup'}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("invalid count", () => {
    search(null, {minCount: "sdfds", maxCount: "asd", startDate: '2018-01-01', endDate: '2019-01-01'}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

test("count is nan", () => {
    search(null, {minCount: 3, maxCount: NaN, startDate: '2018-01-01', endDate: '2019-01-01'}, (err, data) => {
        expect(err).not.toBeNull();
    });
});

describe("happy path", () => {
    const model = mongoose.model("Model", schema);
    
    beforeEach(() => {
        mockingoose.resetAll();
    });

    it('should return empty on empty collection', () => {
        mockingoose(model).toReturn([], 'aggregate');
        search(model, {minCount: 3, maxCount: 5, startDate: '2018-01-01', endDate: '2019-01-01'}, (err, data) => {
            expect(err).toBeNull();
            expect(data).toBe([]);
        });
    });

    it('should return data on nonempty collection', () => {
        mockingoose(model).toReturn([123], 'aggregate');
        search(model, {minCount: 3, maxCount: 5, startDate: '2018-01-01', endDate: '2019-01-01'}, (err, data) => {
            expect(err).toBeNull();
            expect(data).toBe([123]);
        });
    });
});