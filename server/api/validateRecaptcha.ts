import { defineEventHandler, getRequestHeaders, readBody } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);
  const body = await readBody(event);
  const { token } = body;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Récupérer le nom d'hôte (domaine) du client
  const host = headers.host;

  if (!token) {
    return { success: false, message: 'No token provided', hostname: host };
  }
  if (!secret) {
    return { success: false, message: 'No secret key provided', hostname: host };
  }

  try {
    const result = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret,
        response: token,
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const data = result.data || {};

    if (!data.success) {
      return { success: false, error: 'Invalid reCAPTCHA response', hostname: data.hostname || host, details: data['error-codes'] };
    }

    return { success: true, hostname: data.hostname || host }; // Inclure le nom d'hôte dans la réponse

  } catch (err) {
    console.error('Erreur lors de la validation reCAPTCHA :', err);
    return { success: false, error: 'captcha_error', hostname: host };
  }
});
