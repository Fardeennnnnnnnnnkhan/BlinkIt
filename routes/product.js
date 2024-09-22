const express = require("express");
const router = express.Router();
const { productModel, validateProduct } = require("../models/productModel");
const upload = require("../config/multerconfig");
const {categoryModel , validateCategory} = require('../models/CategoryModel')
const {validateAdmin , Isloggedin} = require('../middleware/adminMiddleware');
const { cartModel , validateCart } = require("../models/CartModel");

router.get("/",Isloggedin ,  async function (req, res) {
  let somethingInCart = false;
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
  let cart = await cartModel.findOne({user : req.session.passport.user});
  if(cart && cart.products.length > 0) somethingInCart = true;
 let rnproducts = await productModel.aggregate([
    {$sample : {size :3} }
  ])


  // Convert array to desired object format
  const result = productsByCategory.reduce((acc, item) => {
    acc[item._id] = item.products;
    return acc;
  }, {});
  
//   console.log(result);
  res.render("index" , {products   :  result , rnproducts , somethingInCart , cartCount : cart ?  cart.products.length : 0} );
});




router.post("/", upload.single("image"), async function (req, res) {
  let { name, price, category, stock, description, image } = req.body;
  let { error } = validateProduct({
    name,
    price,
    category,
    stock,
    description,
    image,
  });
  if (error) {
    res.send(error.message);
  }
//   console.log(req.file);
let isCategory = await  categoryModel.findOne({name : category});
if(!isCategory){
   await categoryModel.create({name : category})
}

  let product = await productModel.create({
    name,
    price,
    category,
    stock,
    description,
    image : req.file.buffer,
  });

  res.redirect('/admin/dashboard')
});

router.get("/delete/:id", validateAdmin , async function (req, res) {
if(req.user.admin){
        let prods = await productModel.findOneAndDelete({_id : req.params.id});
        return res.redirect('/admin/products');
}
else{
    res.send("You are not allowed to delete this product")

}
});

router.post("/delete", validateAdmin , async function (req, res) {
    if(req.user.admin){
            let prods = await productModel.findOneAndDelete({_id : req.body.product_id});
            return res.redirect('back');
    }
    else{
        res.send("You are not allowed to delete this product")
    
    }
    });
module.exports = router;
