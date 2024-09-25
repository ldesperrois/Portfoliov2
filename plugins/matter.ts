import Matter from 'matter-js';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp)=>{

    nuxtApp.provide('Matter', Matter);

})