import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = body;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return { success: false, message: 'No token provided' };
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
         method:"POST",
        params: {
          secret:"6Ld4eToqAAAAAC5g-iEdiXxVY61kshxb2Wr9uZVJ",
          response: token,
          
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );
    console.log('Response data:', response.data);  // Log detailed response

    // Check for error codes
    if (response.data.success) {
      return response.data;
    } else {
      return { success: false, message: 'reCAPTCHA verification failed', errorCodes: response.data['error-codes'],secret };
    }
  } catch (err) {
    console.log(err);
    throw err.response ? err.response.data : {success: false, error: 'captcha_error',test:secret}
  }
});
