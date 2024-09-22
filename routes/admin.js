const express = require('express');
const router = express.Router();
const {adminModel} = require('../models/AdminModel'); // Ensure proper export from AdminModel
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
const {validateAdmin} = require('../middleware/adminMiddleware');
const { productModel } = require('../models/productModel');
require('dotenv').config();

if (typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "DEVELOPMENT") {

    router.get('/create', async function(req, res) {
        try {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash("admin", salt);

            let admin = new adminModel({
                name: "fardeen khan",
                email: "admin@blink.com",
                password: hash,
                role: "admin"
            });

            await admin.save();

            let token = jwt.sign({ email: "admin@blink.com" , admin : true }, process.env.JWT_SIGN);
            res.cookie("token", token);
            res.send("Admin Created Successfully");

        } catch (err) {
            res.send(err.message);
        }
    });
}

router.get('/login', function(req, res) {
    res.render("admin_login"); 

});

router.post('/login', async function(req, res) {
    let { email, password } = req.body;

    try {
        let admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.send("This Admin is Not Available");
        }

        let valid = await bcrypt.compare(password, admin.password);

        if (!valid) {
            return res.send("Invalid Password");
        }

        let token = jwt.sign({ email: admin.email, role: admin.role  , admin : true}, process.env.JWT_SIGN);
        res.cookie("token", token);
        res.redirect('/admin/dashboard'); // Redirect to profile or any authenticated route

    } catch (err) {
        res.send(err.message);
    }
});


router.get('/products' , async function (req , res){
    const productsByCategory = await productModel.aggregate([
        {
          $group: {
            _id: "$category",
            products: {
              $push: {
                _id: "$_id", 
                name: "$name",
                price: "$price",
                stock: "$stock",
                description: "$description",
                image: "$image"
              }
            }
          }
        }
      ]);
      
      // Convert array to desired object format
      const result = productsByCategory.reduce((acc, item) => {
        acc[item._id] = item.products;
        return acc;
      }, {});
      
    //   console.log(result);

    let products = productModel.find();
    res.render("admin_products" , {products : result });
} )
router.get('/dashboard' , validateAdmin ,async  function(req , res){
    let prodcount =await productModel.countDocuments();
    let categcount =await productModel.countDocuments();
    res.render("admin_dashboard" , {prodcount , categcount})
})

router.get('/logout', function(req, res) {
   res.cookie("token" ,"");
   res.redirect('/admin/login') 

});
module.exports = router;
 