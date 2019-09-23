const express = require('express')
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const transporter = require('../services/email.service.js');
const axios = require('axios');
const emailNotification = (req,res) =>{
    var mailOptions = {
        from: 'satnammca@gmail.com',
        to: req.body.email,
        subject: 'Account Confirmation email',
        html: `<p> <strong>Hi ${req.body.username},</strong></p>
        <p>To continue creating your USCIS Account, you must confirm your email address. To confirm your email address, 
        please click on the link below, or copy and paste the entire link into your browser. </p>
        <p><a href="http://localhost:3000/api/account-confirmation?email=${req.body.email}" >Confirm </a></p>

        <p>Regards,<br/>Account Team </p>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).json({ error: error })
        } else {
            res.status(200).send({ message: info.response });
            console.log('Email sent: ' + info.response);
        }
    });
}

router.get('/account-confirmation',async (req, res) => {
    

    try {
        const user = await User.findOneAndUpdate({ email: req.query.email },{$set: {accountStatus: 'confirm'}});  

        res.status(200).json({ result: {  status: 'successfully confirm' } }) 
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.username });
    if (user) {
        try {
            const match = await bcrypt.compare(req.body.password, user.password);

            match ? res.status(200).json({ result: { user: user.username, status: 'success' } }) : res.status(500).json({ result: "incorrect password" })

        } catch (error) {
            res.status(500).json({ error: error })
        }
    } else {
        res.json({ result: 'User not found' });
    }
})
router.post('/create-user', function (req, res) {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({ error: error })
        } else {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            user.save().then((data) => {

                emailNotification(req,res);

            }, error => {
                res.status(500).json({ error: error })
            })
        }
    })
})
router.delete('/delete/:userId', async (req, res) => {

    try {
        const user = await User.deleteOne({ username: req.params.userId });
        res.status(200).send({ message: 'user deletd' });
    } catch (error) {
        res.status(500).json({ error: error })
    }
})




module.exports = router;
