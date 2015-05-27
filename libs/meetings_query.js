
/**
 * Add a function filter (like $in, or $gte) to a attribute
 * 
 * @param queryObject The query to add to
 * @param attribute The attribute to add to
 * @param functionName The function to add
 * @param value The value
 */
function addFunctionFilter(queryObject, attribute, functionName, value) {
  queryObject[attribute] = queryObject[attribute] || {};
  queryObject[attribute][functionName] = value;
}

/**
 * Parses a query string into a mongodb query
 * 
 * @param querystring The querystring to parse
 */
function parseQueryString(querystring) {
  var filters = {
    after: querystring.after ? Date.parse(querystring.after) : null,
    before: querystring.before ? Date.parse(querystring.before) : null,
    tags: querystring.tags ? querystring.tags.split(',').map(function(x) { return x.trim(); }) : null,
    organizers: querystring.organizers ? querystring.organizers.split(',').map(function(x) { return x.trim(); }) : null,
    cities: querystring.cities ? querystring.cities.split(',').map(function(x) { return x.trim(); }) : null
  };
  return filters;
}

/**
 * Build the MongoDB query from the filter
 */
function buildMongoQuery(filter) {
  var query = {};
  
  if(filter.after) {
    addFunctionFilter(query, "starts_at", "$gte", filter.after);
  }
  if(filter.before) {
    addFunctionFilter(query, "starts_at", "$lte", filter.before);
  }
  if(filter.tags) {
    addFunctionFilter(query, "tags", "$in", filter.tags);
  }
  if(filter.organizers) {
    addFunctionFilter(query, "organizers", "$in", filter.organizers);
  }
  if(filter.cities) {
    addFunctionFilter(query, "city", "$in", filter.cities);
  }

  return query;
}

module.exports = {
  parseQueryString: parseQueryString,
  buildMongoQuery: buildMongoQuery
};
