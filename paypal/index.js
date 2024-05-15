const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// TUKI KONFIGURIRAM PAYPAL SDK
paypal.configure({
  'mode': 'sandbox', 
  'client_id': process.env.PAYPAL_CLIENT_ID, //MOJ CLIENT ID IZ .ENV DATOTEKE
  'client_secret': process.env.PAYPAL_CLIENT_SECRET //MOJ SECRET IZ .ENV DATOTEKE
});

// OMOGOČA BRANJE PODATKOV 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// OBDELAVA TRANSAKCIJ
app.post('/pay', (req, res) => {
  const payeeEmail = "janeznovak@personal.example.com";
  const datasetId = req.body.datasetId;
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "transactions": [{
      "amount": {
        "total": "100.00",
        "currency": "USD"
      },
      "payee": {
        "email": payeeEmail
      },
      "description": "Transfer between sandbox accounts"
    }],
    "redirect_urls": {
      "return_url": `http://localhost:${PORT}/success?datasetId=${datasetId}`,
      "cancel_url": `http://localhost:${PORT}/cancel`
    }
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.error('Create Payment Error:', JSON.stringify(error));
      res.status(500).send('Payment Creation Failed');
    } else {
      let approvalUrl;
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          approvalUrl = payment.links[i].href;
          break;
        }
      }
      res.status(200).json({ approvalUrl: approvalUrl });
    }
  });
});


// POT ZA USPESNO IZVEDBO PLACILA
app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "100.00"
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.error('Execute Payment Error:', JSON.stringify(error.response));
      res.redirect('http://localhost:3000/paypal/failed'); // Redirect to a failure page on your frontend
    } else {
      console.log('Payment Success:', JSON.stringify(payment));
      res.redirect(`http://localhost:3000/paypal/success?datasetId=${req.query.datasetId}`);
    }
  });
});

// POT ZA PREKLIC PLACILA
app.get('/cancel', (req, res) => {
  res.send('Payment Cancelled');
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});