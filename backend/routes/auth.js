const express = require('express')
const User = require('../models/user')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Shubhamisagoodboy'

// ROUTE 1:Create a User using POST "/api/auth/createuser". No login required
router.post('/createuser', [
   body('name','Enter a valid name').isLength({min: 3}),
   body('email','Enter a valid Email').isEmail(),
   body('password','password must be atleast 5 characters').isLength({min: 3}),
] , async (req, res) =>{
let success = false;

   // console.log(req.body)
   // const user = User(req.body);
   // user.save()

   // If there are errors return bad request and the errors
   const errors = validationResult(req);
   if(!errors.isEmpty()){
      return res.status(400).json({success, errors: errors.array()})
   }

// Check whether the user with this email exists already
try {
   
   let user = await User.findOne({email: req.body.email});
   if(user){
      return res.status(400).json({error: "Sorry with this email already exists"})
   }

   const salt = await bcrypt.genSalt(10);
   const secPass = await bcrypt.hash(req.body.password, salt) 
     
   user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: secPass,
      })
      // .then(user => res.json(user))
      // .catch (err => {console.log(err)
      //    res.json({error: "Pls enter unique value for email", message: err.message})})

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET )
      // console.log(jwtData)
      // res.json({user})
      success=true
      res.json({success, authtoken})
      
} catch (error) {
  console.error(error.message) 
  res.status(500).send("Internal Some error")
}
   
})

//ROUTE2:  Authenticate a User using :POST "/api/auth/login". No login required
router.post('/login', [
   body('email','Enter a valid Email').isEmail(),
   body('password','Password cannot be blank').exists(),
] , async (req, res) =>{
   let success = false;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
   }

   
   try {
      const {email, password} = req.body;
      let user  = await User.findOne({email})
      if(!user){
         success = false;
         return res.status(400).json({success, error: "please try to login with correct credentials"})
      }
      
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
         success = false;
         return res.status(400).json({success, error: "please try to login with correct credentials"})

      }

      const data = {
         user: {
            id: user.id
         }
      }

      const authtoken = jwt.sign(data, JWT_SECRET )
      success = true
      res.json({success, authtoken})



   }catch (error) {
      console.error(error.message) 
      res.status(500).send("Internal Some error")
    }
})

// Route 3:Get logged User details using :POST "/api/auth/getuser". login required
router.post('/getuser',fetchuser, async (req, res) =>{
try {
   userId = req.user.id;
   const user = await User.findById(userId).select("password")
   res.send(user)

} catch (error) {
   console.error(error.message) 
   res.status(500).send("Internal Some error")
 }

})

module.exports = router