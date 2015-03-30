
function addFunctionFilter(queryObject, attribute, functionName, value) {
    queryObject[attribute] = queryObject[attribute] || {};
    queryObject[attribute][functionName] = value;
}

function parseQueryString(query) {
    var filters = {
        after: query.after ? Date.parse(query.after) : null,
        before: query.before ? Date.parse(query.before) : null,
        tags: query.tags ? query.tags.split(',').map(function(x) { return x.trim(); }) : null,
        organizers: query.organizers ? query.organizers.split(',').map(function(x) { return x.trim(); }) : null,
        cities: query.cities ? query.cities.split(',').map(function(x) { return x.trim(); }) : null
    };
    return filters;
}

function buildMongoQuery(filter) {
    query = {}
    
    if(filter.after) {
        addFunctionFilter(query, "starts_at", "$gte", filter.after);
    }
    if(filter.before) {
        addFunctionFilter(query, "starts_at", "$lte", filter.before);
    }
    if(filter.tags) {
        addFunctionFilter(query, "tags", "$in", req.filters.tags);
    }
    if(filter.organizers) {
        addFunctionFilter(query, "organizers", "$in", req.filters.organizers);
    }
    if(filter.cities) {
        addFunctionFilter(query, "city", "$in", req.filters.cities);
    }

    return query;
}

module.exports = {
    parseQueryString: parseQueryString,
    buildMongoQuery: buildMongoQuery
};
