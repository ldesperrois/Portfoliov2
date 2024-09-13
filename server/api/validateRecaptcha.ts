import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = body;
  const secret = useRuntimeConfig().private.recaptchaSecretKey;

  if (!token) {
    return { success: false, message: 'No token provided' };
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret,
          response: token,
        },
      }
    );
    console.log('Response data:', response.data);  // Log detailed response

    // Check for error codes
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: 'reCAPTCHA verification failed', errorCodes: response.data['error-codes'] };
    }
  } catch (error) {
    console.error('Error during reCAPTCHA verification:', error.response?.data || error.message);
    return { success: false, message: 'Error during reCAPTCHA verification', error: error.response?.data || error.message };
  }
});
