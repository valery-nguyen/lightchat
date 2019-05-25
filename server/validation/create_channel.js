const Validator = require("validator");
const validText = require('./valid-text');

module.exports = function (data) {
  let errors = {};

  data.name = validText(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Channel field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};