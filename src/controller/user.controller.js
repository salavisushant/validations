const express = require('express');

const {body,validationResult} = require("express-validator");

const router = express.Router();

const User = require('../models/user.model')

router.post(
  '/',
  body("first_name").notEmpty().withMessage("first name is required"),
  body("last_name").notEmpty().withMessage("last name is required"),
  body("email").isEmail().withMessage("please provide valid email address"),
  body("pincode").isLength({min:6,max:6}).withMessage("pincode should be 6 digits"),
  body("age").custom((value)=>{
    const isNumber = /^[1-100]*$/.test(value);
    if(!isNumber || value <=0 || value >=100){
      throw new Error("Age should be between 1 and 100")
    }
    return true;
  }),
  body("gender").isIn(["male", "female","others"]).withMessage("Please put valid gender"),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let newErrors = errors.array().map((err) =>err.msg);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.create(req.body);      
        return res.status(201).send(user);
    } catch (e) {
        return res.status(500).send({ message: e.message, status: "Failed" });
    }
    
})

router.get('/',async (req, res) => {
    try {
      const user = await User.find().lean().exec();
      return res.send(user);
    } catch (e) {
        return res.status(500).send({ message: e.message, status: "Failed" });
    };
});

module.exports = router;