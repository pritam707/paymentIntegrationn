const express = require('express')
const app = express()
const Razorpay = require('razorpay');
const crypto = require('crypto')

const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

require('dotenv').config()
const port = 5001 || process.env.PORT

//============================================================================================================

//razorpay
const razorpay = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});

app.post('/payment', async (req, res) => {

    try {

        const { amount } = req.body

        const order = await razorpay.orders.create({
            amount: parseInt(amount) * 100, // Amount in paise (e.g., 50000 paise = INR 500)
            currency: process.env.currency,
            receipt: 'order_receipt_123',
            payment_capture: 1, // Set to 1 for automatic capture or 0 for manual capture
            notes: { note: "this is not" }
        });


        res.status(200).json({ order })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ err })
    }

})


app.post('/payment/callback', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.key_secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment is valid
        // Perform necessary actions (e.g., update order status, send confirmation email, etc.)

        res.status(200).json({ status: true, message: 'Payment verified successfully' });
    } else {
        // Payment is not valid
        res.status(400).json({ status: false, error: 'Invalid payment' });
    }
});



//paypal
const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode: process.env.mode, // or 'live' for production
    client_id: process.env.client_id,
    client_secret: process.env.client_secret
});

app.post('/paypal_payment', async (req, res, cb) => {

    const { amount } = req.body

    const payment = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        // redirect_urls: {
        //     return_url: 'http://your-website.com/success',
        //     cancel_url: 'http://your-website.com/cancel'
        // },
        transactions: [{
            amount: {
                total: amount,
                currency: process.env.INR
            },
            description: 'Sample payment description'
        }]
    };

    await paypal.payment.create(payment, (err, createdPayment) => {
        if (err) {
            res.json({ status: 'error', message: 'Payment verification failed', err });
        }
        else {
            cb(null, createdPayment);

            res.json({ status: 'success', message: 'Payment successful', createdPayment });
        }
    });

    // Redirect the user to createdPayment.links[1].href for approval

})


//stripe 
const Stripe = require('stripe')(process.env.secret_key)

app.post('/stripe-checkout-session', async (req, res) => {

    let status, error;
    const { amount } = req.body


    try {
        const session = await Stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'coffee',
                        },
                        unit_amount: amount, // Price in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://35.188.5.60:3000/success',
            cancel_url: 'http://35.188.5.60:3000/unsuccess',
        });

        status = 'success'
        res.redirect(session.success_url);
    }
    catch (err) {
        console.log(err)

        status = 'unsuccess'
    }
});

//============================================================================================================

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
