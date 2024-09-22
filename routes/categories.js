const express = require("express");
const router = express.Router();
const {categoryModel , validateCategory} = require('../models/CategoryModel')
const validateAdmin = require('../middleware/adminMiddleware')


router.post('/create' , function(req , res){
    let category = categoryModel.create({
        name : req.body.name,
    })
    res.redirect("back")
})

module.exports = router;