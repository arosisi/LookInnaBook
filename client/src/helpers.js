export const transform = user => ({
  id: user.u_id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  creditCard: user.card_number,
  expiryDate: user.expiry_date,
  cvv: user.cvv,
  holderName: user.holder_name,
  billingAddress: user.billing_address
});
