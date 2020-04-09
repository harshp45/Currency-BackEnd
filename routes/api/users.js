const express = require('express');
const app = express();
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const userslist = require('../../models/User');

const router = express.Router();

//Adding the data using POSTMAN
router.post('/add',[
    
    //Validation
    check('name').isLength({ min:4 }),
    check('email', 'Please enter valid email').isEmail(),
    check('password','Please Enter password').isLength({ min:3 })

], async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    {
        return res.status(422).json({ errors: errors.array() });
    }
    else
    {
        try
        {
            //check if user email is already in the database
            let user1 = await userslist.findOne({email: req.body.email});
            if(user1)
            {
                return res.status(400).json({error: [{msg: 'user already exists'}]})
            }
            else
            {
                const newuser = new userslist({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                
                //hash the password
                const salt = await bcrypt.genSalt(10);
                newuser.password = await bcrypt.hash(req.body.password, salt);
                
                //Save the user
                const nUser = await newuser.save();
                
                console.log("User Added");
                res.send(nUser);
                res.end();   
            }    
        }
        catch (err) 
        {
            res.status(500).send('Server Error'+err);
        }
    }
});

//User Login and generating token
router.post('/login', async (req, res) => {
 
    //Checking email for login
    const loginuser= await userslist.findOne({email:req.body.email});
    if(!loginuser)
    {
       return res.send("No Such User Found");
    }
    //checking password for login
    const Userpassword = await bcrypt.compare(req.body.password, loginuser.password);
    
    if(!Userpassword)
    {
        return res.status(400).send("Incorrect Password");

    }
    else
    {
        //Generate Token
        const payload = {
            user : {
                id: loginuser.id,
                name: loginuser.name
            }
        };
       
        const token = jwt.sign(payload, config.get('jwtsecret'), {
                algorithm: 'HS256',
                expiresIn: 300000});

        console.log("Successfully Logged In");
        res.send("Successfully Logged In. Token = " + JSON.stringify(token));
    }

});
module.exports = router;