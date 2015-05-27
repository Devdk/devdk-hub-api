var Validator = require('jsonschema').Validator;
var validator = new Validator();

var JsonValidator = {
  /**
  * @param obj The object to validate
  * @param schema the JSON Schema to validate against
  * 
  * @returns a object with the attribute valid, and a list of errors
  */
  validate: function(obj, schema) {
    var result = validator.validate(obj, schema);
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
  }
};

module.exports = JsonValidator;