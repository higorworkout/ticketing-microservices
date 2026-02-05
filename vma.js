const random = require('crypto');
const scrypt = require('crypto');
const promisify = require('util');


const scryptAsync = promisify(scrypt);
const salt = random.randomBytes(8).toString('hex');
const buf = scryptAsync("password", salt, 64)


console.log(buf)
