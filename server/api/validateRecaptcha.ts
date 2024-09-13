// server/api/validRecaptcha.ts

import { defineEventHandler, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = body;
  // Récupération clé secrète
  const secret = useRuntimeConfig().private.recaptchaSecretKey;
  if (!token) {
    return { success: false, message: 'No token provided' };
  }

  try {
    // requête à l'api de vérification de google
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
    // retourne la promesse et ses données
    console.log(response.data)
    return response.data;
  } catch (error) {
    return { success: false, message: 'Error during reCAPTCHA verification', error,secret,token };
  }
});
