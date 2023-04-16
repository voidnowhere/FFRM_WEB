import React, {useEffect, useState} from "react";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import './CheckoutForm.css';
import {Spinner} from "react-bootstrap";
import {Report} from 'notiflix/build/notiflix-report-aio';

export default function CheckoutForm(props) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isElementsReady, setIsElementsReady] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const {error} = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error === undefined) {
            Report.success(
                'Success',
                'Payment succeeded!',
                'Okay',
                {backOverlay: false}
            );
            props.setReservations((prevState) => prevState.map(reservation => {
                if (reservation.id === props.currentReservationId) {
                    reservation.is_paid = true;
                }
                return reservation;
            }));
            props.setShowPaymentModal(false);
            return;
        }

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (

        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement onReady={() => setIsElementsReady(true)} id="payment-element"
                            options={paymentElementOptions}/>
            {
                (!isElementsReady) ?
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary"/>
                    </div>
                    :
                    <button disabled={isLoading || !stripe || !elements} id="payment-form-submit">
                        <span id="button-text">
                          {isLoading ? <div className="payment-form-spinner" id="spinner"></div> : "Pay now"}
                        </span>
                    </button>
            }
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}