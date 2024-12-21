const express = require('express')
const router = express.Router();

const {cartModel, validateCart} = require('../models/CartModel');
const {Isloggedin} = require('../middleware/adminMiddleware');
const { productModel } = require('../models/productModel');
router.get('/', Isloggedin, async function (req, res) {
    try {
      let cart = await cartModel
        .findOne({ user: req.session.passport.user })
        .populate('products');
      
      // Render the cart.ejs view and pass the entire cart object

      let cartDataStructure = {};
      
      cart.products.forEach( product =>{
          let key = product._id.toString();
          if(cartDataStructure[key]){
            cartDataStructure[key].quantity += 1;
          }else{
            cartDataStructure[key]={
              ...product._doc,
              quantity  : 1,
            }
          }
      })
      let finalPrice = Object.values(cartDataStructure).reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
  
      // Convert cartDataStructure to an array
      let finalarray = Object.values(cartDataStructure);
      let deliveryCharge = 28 // Between ₹20-₹70
    let smartCartCharge =  14 // Between ₹10-₹40
    let handlingCharge =  6 // Between ₹10-₹30
    let rnproducts = await productModel.aggregate([
      {$sample : {size :3} }
    ])
  
  
      res.render('cart', { cart: finalarray,rnproducts : rnproducts, finalprice: finalPrice  , deliveryCharge , smartCartCharge , handlingCharge , userid : req.session.passport.user});
  
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
router.get('/add/:id',Isloggedin ,async  function(req , res){
 try{ 

    let cart = await cartModel.findOne({user : req.session.passport.user})
    let product = await productModel.findOne({_id : req.params.id})
    if(!cart) {
       cart = await cartModel.create({
            user : req.session.passport.user,
            products : [req.params.id],
            totalPrice : Number(product.price)
        });
    }
    else{
        cart.products.push(req.params.id);
        cart.totalPrice = (Number(cart.totalPrice) + Number(product.price));
      }
      await cart.save();

    res.redirect("back");
 }catch(err){
    res.send(err.message);

 }
})

router.get('/remove/:id' ,Isloggedin , async  function(req, res){
  try{
    let cart = await cartModel.findOne({user : req.session.passport.user});
    let product = await productModel.findOne({_id : req.params.id})

    if(!cart) {
      return res.send("The Cart is Empty");
    }
    else{
     let prodId =  cart.products.indexOf(req.params.id);
     cart.products.splice(prodId ,1);
      cart.totalPrice = Number(cart.totalPrice) - Number(product.price)
      await cart.save();
    }
  }catch(err){
    res.send(err.message)
  }
   
   res.redirect("back");
})
router.get('/remove/:id' ,Isloggedin , async  function(req, res){
    let cart = await cartModel.findOne({user : req.session.passport.user});
    if(!cart) return res.send("Something went wring while removing the element from the cart");
    let index = cart.products.indexOf(req.params.id);
   if(index !== -1) cart.products.splice(index , 1);
   else return res.send("No suchh element is present in the cart");

   await cart.save();
   res.redirect(back);
})

router.post('/remove-cart' , async function(req ,res){
  try {
    const userId = req.user.id; // Assuming you're using a token-based auth system
    await CartModel.findOneAndUpdate({ user: userId }, { products: [], totalPrice: 0 });
    return res.status(200).json({ message: "Cart cleared successfully" });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error clearing cart" });
}
})


module.exports = router;