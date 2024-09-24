import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = body;
  const secret : string | undefined = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return { success: false, message: 'No token provided' };
  }
  if(!secret){
    return {sucess : false, message : 'No key provided'}
  }

  try {
    const result = await axios.post('https://www.google.com/recaptcha/api/siteverify', 
      new URLSearchParams({
        secret: secret,
        response: token
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const data = result.data || {};

    if (!data.success) {
      throw {
        success: false,
        error: 'Response not valid'
      };
    }

    return data;  // Retourner les données reçues

  } catch (err) {
    console.log(err);
    throw err.response ? err.response.data : { success: false, error: 'captcha_error' };
  }
});
