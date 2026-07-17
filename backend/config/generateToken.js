const crypto = require("crypto");


const generateToken = function generateToken(){
  return crypto.randomBytes(32).toString("hex");
}

module.exports = { generateToken };
