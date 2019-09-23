var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.DB_EMAIL,
    pass: process.env.DB_PASSWORD
  }
});


module.exports = transporter;