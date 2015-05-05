var JsonValidator = require('jsonschema').Validator;
var jsonValidator = new JsonValidator();

/**
 * @param obj The object to validate
 * @param schema the JSON Schema to validate against
 * 
 * @returns a object with the attribute valid, and a list of errors
 */
module.exports.validate = function(obj, schema) {
    var result = jsonValidator.validate(obj, schema);
    var prefixLength = "instance.".length;
    
    return {
      valid: result.valid,
      errors: result.errors.map(function(e) {
        return {
          property: e.property.substring(prefixLength),
          message: e.message
        };
      })
    };
};