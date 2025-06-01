// frontend/src/config/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe public key
export const STRIPE_PUBLIC_KEY = 'pk_live_51RC7BoKFvIUsiSUX1eWD374M9uoavh8zLpgo9wcau0PW8ULVtrVTCmkyhd69FqzYa8bLdClR35MNsWRz9MHbXEba00t6QZTVpa';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
export default stripePromise; 