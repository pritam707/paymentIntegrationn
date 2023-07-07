import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useState } from 'react'



const PaypalModel = ({ callback, amount }) => {

    const [isPaid, setIsPaid] = useState()

    const paypalOptions = {
        "client-id": 'paypal_client_id' //please provide paypal_client_id
    };

    const createOrder = ((data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount
                    },
                    currency: "IN"

                }
            ]
        })

    })

    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            setIsPaid(true);
            console.log(isPaid)
            console.log(details); // Do something with the captured payment details
        });
    };


    return (
        <div className='modal_wrapper'>
            <div className='modal_box'>
                <button onClick={callback} className='btn6'> x</button>
                <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
                </PayPalScriptProvider>

            </div>

        </div>)
}

export default PaypalModel