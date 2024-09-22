const express = require('express')
const router = express.Router()
const {paymentModel} = require('../models/paymentSchema')
router.get('/order/:orderid/:paymentid/:signature' ,async  function(req , res){

let paymentDetails = await paymentModel.findOne({
    orderId : req.params.orderid
})
if(!paymentDetails) return res.send("Payment  not completed")

    if(req.params.signature === paymentDetails.signature &&  req.params.paymentid === paymentDetails.paymentId){
        res.send("Valid Payment")
    }
    else{
        res.send("Invalid Payment")
    }
})

module.exports = router