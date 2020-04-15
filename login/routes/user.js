const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../database/models/user');
const tokenModel = require('../../models/token');
const passport = require('../passport');

router.post('/signup', (req, res) => {
    console.log('user signup');

    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post(
    '/login',
     function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    async (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);

        //Generate Token
        const payload = {
            user : {
                id: req.user.id,
                username: req.user.username
            }
        };
       
        const token = jwt.sign(payload, config.get('jwtsecret'), {
                algorithm: 'HS256',
                expiresIn: 30000000});
  
        console.log("Successfully Logged In"+JSON.stringify(token));

        //Updating Token
        try 
        {
            var tokenResponse = token;
            console.log("Res: "+tokenResponse);
            const newtoken = await tokenModel.findById("5e964be013bfd01bdc246524");

            newtoken.token = tokenResponse;

            const nToken = await newtoken.save();
        }
        catch (err) {
            res.status(500).send('Server Error');
        }
    }
)

router.get('/', (req, res, next) => {
    console.log('=== user!!===')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.get('/token', async (req,res) => {
    try
    {
        const tokenDb = await tokenModel.findOne();
        res.send(tokenDb);

    }
    catch (err)
    {
        res.status(500).send('Server Error');
    }
});

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

module.exports = router;