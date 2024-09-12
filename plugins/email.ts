import { init } from '@emailjs/browser';
import { defineNuxtPlugin } from '#app';
/**
 * On ajoute un plugin d'email à l'application
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Récupération de la clé public
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    init(publicKey);
  }
  nuxtApp.provide('emailjs', {
    /**
     * Fonction qui récupère le formulaire et identifiant nécessaire pour envoyer l'email
     * 
     * @param serviceID 
     * @param templateID 
     * @param form 
     * @param publicKey 
     * @returns 
     */
    sendForm: (serviceID: string, templateID: string, form: HTMLFormElement,publicKey:string) => {
      return import('@emailjs/browser').then(({ sendForm }) => {
        return sendForm(serviceID, templateID, form,publicKey);
      });
    }
  });
});
