const jwt = require("jsonwebtoken");
const passport = require("passport");

async function validateAdmin(req , res , next) {
   try{
    let token = req.cookies.token;
    if(!token) return res.send("You need to login First");
    let data = await jwt.verify(token , process.env.JWT_SIGN);
    req.user = data; 
    next();
   }catch(err){
        res.send(err.message);

   }
}


async function Isloggedin(req ,res ,next){
  if(req.isAuthenticated())return next();
  res.redirect('/users/login')
}
module.exports = {validateAdmin , Isloggedin};