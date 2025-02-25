const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Replace these with your actual values
const privateKey = fs.readFileSync(path.resolve(__dirname, 'AuthKey_XXXXX.p8')).toString();
const teamId = 'YOUR_TEAM_ID';
const keyId = 'YOUR_KEY_ID';

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d', // Token expires in 180 days
  issuer: teamId,
  header: {
    alg: 'ES256',
    kid: keyId
  }
});

console.log(token); 