import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    "@nuxt/image", 
    '@vesp/nuxt-fontawesome', 
    'nuxt-swiper', 
  ],
  fontawesome: {
    icons: {
      solid: ['envelope', 'close', 'bars','link'],
      brands: ['instagram', 'linkedin', 'github']
    }
  },

  build: {
    transpile: ['@fortawesome/vue-fontawesome']
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500&display=swap'
        }
      ],
      title:'Portfolio - Lucas Desperrois'
    }
  },

  css: [
    '@/assets/scss/main.scss'
  ],

  plugins: [
    '@/plugins/fontawesome.ts',
    '@/plugins/email.ts'
  ],

  runtimeConfig: {
    public: {
      emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY,
      emailjsServiceId: process.env.EMAILJS_SERVICE_ID,
      emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID,
    },
    
    
    
  },
  

  compatibilityDate: '2024-09-01',
});
