console.log('Braintree.js is loaded');

// braintree.client.create({
//   authorization: 'CLIENT_AUTHORIZATION'
// }, function (clientErr, clientInstance) {
//   if (clientErr) {
//     // Handle error in client creation
//     return;
//   }

//   var options = {
//     client: clientInstance,
//     styles: {
//       /* ... */
//     },
//     fields: {
//       /* ... */
//     }
//   };

//   braintree.hostedFields.create(options, function (hostedFieldsErr, hostedFieldsInstance) {
//     if (hostedFieldsErr) {
//       // Handle error in Hosted Fields creation
//       return;
//     }

//     // Use the Hosted Fields instance here to tokenize a card
//   });
// });

var paypalButton = document.querySelector('.paypal-button');

// Create a client.
braintree.client.create({
  authorization: CLIENT_AUTHORIZATION
}, function (clientErr, clientInstance) {

  // Stop if there was a problem creating the client.
  // This could happen if there is a network error or if the authorization
  // is invalid.
  if (clientErr) {
    console.error('Error creating client:', clientErr);
    return;
  }

  // Create a PayPal component.
  braintree.paypal.create({
    client: clientInstance
  }, function (paypalErr, paypalInstance) {

    // Stop if there was a problem creating PayPal.
    // This could happen if there was a network error or if it's incorrectly
    // configured.
    if (paypalErr) {
      console.error('Error creating PayPal:', paypalErr);
      return;
    }

    // Enable the button.
    paypalButton.removeAttribute('disabled');

    // When the button is clicked, attempt to tokenize.
    paypalButton.addEventListener('click', function (event) {

      // Because tokenization opens a popup, this has to be called as a result of
      // customer action, like clicking a button—you cannot call this at any time.
      paypalInstance.tokenize({
        flow: 'vault'
      }, function (tokenizeErr, payload) {

        // Stop if there was an error.
        if (tokenizeErr) {
          if (tokenizeErr.type !== 'CUSTOMER') {
            console.error('Error tokenizing:', tokenizeErr);
          }
          return;
        }

        // Tokenization succeeded!
        paypalButton.setAttribute('disabled', true);
        console.log('Got a nonce! You should submit this to your server.');
        console.log(payload.nonce);

      });

    }, false);

  });

});
