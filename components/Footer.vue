<template>
    <footer id="contact">
        <div class="footer--networks">
            <h3>Mes Réseaux</h3>
            <p>Je suis ouvert pour toutes offres ou propositions</p>
            <p>{{ numero }}</p>
            <div class="footer--networks--ico">
                <NuxtLink class="link-networks" to="mailto:lucas.desperrois29@gmail.com">
                    <font-awesome class="socialnetwork" icon="envelope" />
                </NuxtLink>
                <NuxtLink to="https://www.instagram.com/lucas.dsp/" class="link-networks">
                        <font-awesome class="socialnetwork" :icon="['fab', 'instagram']" />
                </NuxtLink>
                <NuxtLink to="https://www.linkedin.com/in/lucas-desperrois-a453ba262/" class="link-networks">
                        <font-awesome class="socialnetwork" :icon="['fab', 'linkedin']" />
                </NuxtLink>
                <NuxtLink to="https://github.com/ldesperrois" class="link-networks">
                        <font-awesome class="socialnetwork" :icon="['fab', 'github']" />
                </NuxtLink>
            </div>
        </div>
        <form class="footer--email" ref="form" @submit.prevent="submitForm" method="POST">
            <h3>Pour me contacter</h3>
            <div class="container--email">
                <div class="email--nom--mail">
                    <InputsSimple :text="input1" type="text" name="from_name"/>
                    <InputsSimple :text="input2" type="text" name="email_id"/>
                </div>
                <textarea required id="message" name="message" placeholder="Ecrivez votre message"></textarea>
            </div>
            <div id="error-form"></div>
            <button class="button-cv button--antiman button--round-l button--text-medium" id="send" type="submit">
                <i class="button__icon icon icon-map-marker"></i><span>Envoyer</span>
            </button>
        </form>

        <p id="by">Made By ldesperrois</p>
    </footer>
</template>

<script lang="ts">
import { useRuntimeConfig } from '#app';
export default{
    name :"Footer",
    data(){
        return{
            input1:"Nom",
            input2:"Email",
            numero:"+33 7 66 66 78 67",
        }
    },
    setup() {
        // Le formulaire, les variables de configuration et le module email de l'application (voir email.ts)
        const form = ref<HTMLElement | null>(null) 
        const config = useRuntimeConfig();
        const nuxtApp = useNuxtApp();
        /**
         * Fonction qui s'occupe de tester si la saisie du mail est valide
         * @param email 
         */
        const chekEmail = (email:string)=>{
            let pattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(email)
        }
        /**
         * Envoie le formulaire avec les vérifications nécessaire du formulaire 
         * 
         */
        const sendEmail = async ()=>{
            const email = form.value.elements.namedItem("email_id") as HTMLInputElement;
            // Si l'email est valide
            if(chekEmail(email.value)){
                try {
                    await nuxtApp.$emailjs.sendForm(
                    config.public.emailjsServiceId,
                    config.public.emailjsTemplateId,
                    form.value,
                    config.public.emailjsPublicKey
                );
                }
                    catch (error) {
                        console.log('FAILED...', error);
                }
                }
        else{
              throw new Error("Email")  
            }
        }
        /**
         * Fonction qui envoie le mail
         * 
         * @param e 
         */
         const submitForm = async (e) => {
            e.preventDefault();
            const divError = document.getElementById('error-form');
            try {
                // Essaye d'envoyer l'email
                await sendEmail();
                divError.innerHTML = '<span style="color:green">Email envoyé avec succès</span>';
                setTimeout(() => { divError.innerHTML = ''; }, 4000);
                // Reset du formulaire
                e.target.reset();
                let buttonSend = document.getElementById("send");
                // Désactivation du bouton
                buttonSend.disabled=true;
                
                
            } catch (error) 
            {
                // Message d'erreurs
                if(error.message=="Email"){
                    divError.innerHTML = '<span style="color:red">Email non valide</span>';

                }
                else{
                    // Message d'erreur
                    divError.innerHTML = '<span style="color:red">Email envoyé sans succès</span>';
                }
                setTimeout(() => { divError.innerHTML = ''; }, 4000);

                

            }
        };
        return {
            config,
            submitForm,
            form
        };
    },
}
</script>
<style lang="scss" scoped>
    p#by{
        position: absolute;
        bottom: -10px;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
       
    }
    footer{
        position: relative;
        justify-content: space-around;
        padding:3em;
        display: flex;
        background-color: #ECEFF1;
        flex-direction: row;
        .footer--networks{
            display: flex;
            flex-direction: column;
            gap: 25px;
            h3{
                font-size: 28px;
            }
            p{
                font-weight: 300;
                font-size: 18px;
                margin: 0;
            }
            .footer--networks--ico{
                display: flex;
                flex-direction: row;
                color : black;
                gap:20px;
                .link-networks{
                    cursor: pointer;
                    .socialnetwork{
                        font-size: 40px;
                        color: black;
                    }
                }
            }
        }
        .footer--email{
            display: flex;
            flex-direction: column;
            gap: 15px;
            h3{
                font-size: 28px;
            }
            div{
                display: flex;
                flex-direction: column;
                
                .email--nom--mail{
                    display: flex;
                    flex-direction: row;
                    gap: 15px;
                }
                textarea{
                    width: 500px;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-color: #05060f0a;
                    color: rgb(35, 38, 59);
                    overflow: hidden;
                    font-size: 16px;
                    margin: 0;
                    transition: all 100ms ease-in-out;
                    min-height: 100px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
                }
                textarea:focus{
                    outline: none;
                    border-color: #05060f;
                }
            }
            button{
                max-width: 100px;
            }
            button::before{
                border-color: black;
            }
        }
        
    }

    @media screen and (max-width:1050px){
        footer{
            padding-right: 1em;
            padding-left: 1em;
        }
        textarea{
            width: 450px!important;
        }

    }

    @media screen and (max-width:968px){
        footer{
            flex-direction: column;
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            gap: 30px;
        }
        .footer--email{
            order: 1;
            align-items: center;
        }
        .footer--networks{
            order: 2;
            margin-bottom: 80px;
            align-items: center;
            p{
                text-align: center;
            }
        }
        .container--email{
            width: 80%;
        }
        textarea{
            width: 100%!important;
        }
    }

    @media screen and (max-width:768px) {
        .email--nom--mail{
            gap: 0!important;
            flex-direction: column!important;
        }
        .footer--email{
            width: 100%;
        }
        .container--email{
            width: 90%;

        }
        
    }
    
    #result-message {
  margin-top: 20px;
  font-size: 16px;
  color: #ff0000; /* Rouge pour les erreurs */
}

#result-message.success {
  color: #28a745; /* Vert pour les succès */
}
    
    

</style>

