const express=require('express')
const app=express()
const Razorpay=require('razorpay')
app.use(express.json());
const path = require('path');

var instance = new Razorpay({
    key_id: 'rzp_test_ISlndBIl755xkB',
    key_secret: 'AFrK16nAoKbuy8HfcyD3XnNK',
  });

  app.get('/',(req,res) => {
    return res.sendFile(path.join(__dirname,'display.html'))
})


app.post('/create/orderId',(req,res) => {
console.log("create orderid request",req.body);
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
      };

      instance.orders.create(options, function(err, order) {
        console.log("order",order);
        res.send({orderId:order.id})
      });
    

})


app.post("/api/payment/verify",(req,res)=>{
    console.log("verification",req.body);

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'Wok5mJv2F0pa5HKLeXZfUr9r')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
   


app.listen(5000,() => {
    console.log("server is running");
})
