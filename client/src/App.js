import './style/App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Razorpay } from 'razorpay-checkout';
import { BiRupee } from 'react-icons/bi'
import PaypalModel from './model/Paypal';
import StripeCheckout from 'react-stripe-checkout'




function App() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const [paypalModel, setPaypalMOdel] = useState(false);
  const publishableKey = 'pk_test_51LryyESCNJpJNoqU5anxRf19SpcaI7Iw8S1j7CZJC31mdmvH0FE5SDZJTapaJPznOIE4NTtDE9Pg1CAgFya3OEy500AF9nxGGf' //please provide publishable key


  const callback = (res) => {

    axios.post('http://35.188.5.60:5001/payment/callback', { razorpay_order_id: res.razorpay_order_id, razorpay_payment_id: res.razorpay_payment_id, razorpay_signature: res.razorpay_signature })
      .then((result) => {

        if (result.data.status === true) {
          navigate('/success')
        }
        else {
          navigate('/unsuccess')
        }

      })
  }

  const razorpay = () => {

    if (amount.length === 0) {
      setError('Please enter valid Amount')
    }
    else if (parseInt(amount) > 500000) {
      setError('Please enter less than or equal to 500000')
    }
    else {
      axios.post('http://35.188.5.60:5001/payment', { amount })
        .then(async (result) => {


          const options = {
            "key": "rzp_test_I6qot97E2x8jg8", // Enter the Key ID generated from the Dashboard
            "amount": result.data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "coffee", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": result.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: function (response) {

              callback(response)// Handle the response after successful payment
            },
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
              "name": "Pritam Raj", //your customer's name
              "email": "pritam.raj@example.com",
              "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
              "address": "Razorpay Corporate Office"
            },
            "theme": {
              "color": "#3399cc"
            }
          };

          const rzp1 = new Razorpay(options);
          rzp1.open();
        })

        .then((res) => {
          console.log(res)
        })

    }
  }

  const amountHandleChange = () => {

    console.log('')

    if (amount.length === 0) {
      setError('Please enter valid Amount')
    }
    else if (parseInt(amount) > 500000) {
      setError('Please enter less than or equal to 500000')
    }
    else {
      setPaypalMOdel(true)
    }
  }

  const stripeAmountHandleChange = () => {


    if (amount.length === 0) {
      setError('Please enter valid Amount')
    }
    else if (parseInt(amount) > 500000) {
      setError('Please enter less than or equal to 500000')
    }

  }

  //stripe
  const payNow = async token => {
    try {
      const response = await axios({
        url: 'http://35.188.5.60:5001/stripe-checkout-session',
        method: 'post',
        data: {
          amount: amount * 100,
          token: token.id,
        }
      })

      if (response.redirected) {
        window.location.href = response.url;
      }
      else {
        const data = await response.json();
        if (data.status === 'success') {
          navigate('/success')
        } else {
          navigate('/unsuccess')
        }
      }
    } catch (error) {
      navigate('/unsuccess')

    }
  }

  return (
    <div className="App">

      {paypalModel ? <PaypalModel amount={amount} callback={() => {
        setPaypalMOdel(false)

      }} /> : ''}

      <div className="title">
        <p>
          BE GENTLE AND
          <span> Buy me a Coffee </span>
        </p>
      </div>

      <div id="cofee-mug">
        <div id="coffee"></div>
        <div id="ear">
          <div id="inner-ear"></div>
        </div>
        <div id="steam"></div>
        <div id="steam2"></div>
      </div>

      <div className="form">
        <BiRupee style={{ fontSize: '50px', margin: '0px -37px -11px' }} /><input onChange={(e) => {
          setAmount(e.target.value)
          setError('')
        }} autoComplete='off' type=" text" id="amount" placeholder="Amount" autoFocus={true} /><br />
        <div className='btn'>
          <button onClick={razorpay}> Razorpay</button>
          <button onClick={amountHandleChange}>Paypal</button>
          <StripeCheckout

            stripeKey={publishableKey}
            label="Card"
            name="Card"
            amount={amount * 100}
            description={`Please Pay ${amount}`}
            token={payNow}
            currency='INR'
            onClick={amountHandleChange}
            className="custom-stripe-button"
          >
            <button onClick={stripeAmountHandleChange}>Card</button>
          </StripeCheckout>
        </div>

      </div>
      <span id='error'>{error}</span>
    </div >
  );
}

export default App;
