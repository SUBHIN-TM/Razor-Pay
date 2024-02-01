const express = require('express');
const app = express();
const Razorpay = require('razorpay');
app.use(express.json());
const path = require('path');

// Creating a Razorpay instance
var instance = new Razorpay({
    key_id: 'rzp_test_ISlndBIl755xkB',
    key_secret: 'AFrK16nAoKbuy8HfcyD3XnNK',
});

// Serving the HTML page on a GET request
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'display.html'));
});

// Handling the POST request to create an order
app.post('/create/orderId', (req, res) => {
    console.log("create orderid request", req.body);
    var options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "rcp1"
    };

    // Creating an order using the Razorpay instance
    instance.orders.create(options, function (err, order) {
        console.log("order", order);
        res.send({ orderId: order.id });
    });
});

// Handling the POST request to verify the payment
app.post("/api/payment/verify", (req, res) => {
    console.log("verification",req.body);
    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'AFrK16nAoKbuy8HfcyD3XnNK')
        .update(body.toString())
        .digest('hex');
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);

    var response = { "signatureIsValid": "false" }
    if (expectedSignature === req.body.response.razorpay_signature) {
        console.log("sig matched");
        response = { "signatureIsValid": "true" };
    }
    res.send(response);
});

// Listening on port 5000
app.listen(5000, () => {
    console.log("server is running");
});
