var assert = require("assert");
var json_validator = require("../../libs/json_validator");

var test_schema = {
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "size": {
      "type": "number"
    }
  },
  "required": ["title"]
};

describe('json_validator', function() {
  describe('validate', function() {
    it("should accept a valid record", function() {
      var valid_record = {
        title: "My title"
      };
      
      var result = json_validator.validate(valid_record, test_schema);
      
      assert.equal(result.valid, true, "This is a valid object according to the schema, it should return true in valid");
      assert.equal(result.errors.length, 0, "There should not be any errors on a valid object");
    });
    
    it("should reject an invalid record", function() {
      var invalid_record = {
        title: "My title",
        size: "This is a string"
      };
      
      var result = json_validator.validate(invalid_record, test_schema);
      
      assert.equal(result.valid, false, "This is a invalid object according to the schema, it should return false in valid");
      assert.equal(result.errors.length, 1, "There should be one error");
      assert.equal(result.errors[0].property, "size", "The property with a error should be size");
    });
    
    it("should reject a null value", function() {
      
      var result = json_validator.validate(null, test_schema);
      
      assert.equal(result.valid, false, "This is a invalid object according to the schema, it should return false in valid");
    });
  });
});