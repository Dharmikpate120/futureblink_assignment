const validator = require("validator");

function validateEmail(email) {
  return validator.isEmail(email);
}

function validateString(str) {
  return /^[a-zA-Z0-9 ]+$/.test(str) ? true : false;
}
function validateStringArray(Sarr) {
  var res = true;
  Sarr.forEach((str) => {
    if (!/^[a-zA-Z0-9 ]+$/.test(str)) {
      res = false;
      return;
    }
  });
  return res;
}
function validateAddress(str) {
  return /^[a-zA-Z0-9 ,-]+$/.test(str) ? true : false;
}
function validateNumber(str) {
  return /^\d+$/.test(str);
}
function validateUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
function validateBoolean(bool) {
  return booleanConverter(bool) === true || booleanConverter(bool) === false
    ? true
    : false;
}
function booleanConverter(bool) {
  if (bool === "true") {
    return true;
  } else if (bool === "false") {
    return false;
  }
}

function validateEmailFormat(emailFormat) {
  result = true;
  if (!validateString(emailFormat.header)) {
    result = false;
  } else if (!validateString(emailFormat.body)) {
    result = false;
  }
  return result;
}

function validateLeads(leads) {
  result = true;
  leads.every((element) => {
    if (!validateString(element.name)) {
      result = false;
      return false;
    } else if (!validateEmail(element.email)) {
      result = false;
      return false;
    }
    return true;
  });
  return result;
}

function validateSequence(sequence) {
  let result = true;
  let previous = "wait";
  sequence.every((element) => {
    if (element.type === "task") {
      previous = "task";
      result = validateEmailFormat(element.emailFormat);
    } else if (element.type === "wait" && previous !== "wait") {
      previous = "wait";
      result = validateNumber(element.duration);
    } else {
      result = false;
      return false;
    }
    return true;
  });
  return result;
}

module.exports = {
  validateEmail,
  validateString,
  validateStringArray,
  validateAddress,
  validateNumber,
  validateUrl,
  validateBoolean,
  booleanConverter,
  validateLeads,
  validateSequence,
};
