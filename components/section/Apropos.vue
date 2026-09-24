<template>
    <div class="section--apropos"  >
        <div id="decouvrir" ></div>
        <div class="container--apropos">
            <div class="container--image">
                <NuxtImg class="image--apropos" src="/img/LucasD.webp" alt="Lucas Desperrois" />
            </div>
            <div class="container--text--apropos" >
                <div class="text--metier">
                    <h2>{{ t('apropos.devTitle') }}</h2>
                    <p class="text--metier" v-html="t('apropos.devText')"></p>
                </div>
                <div class="text--experience" >
                    <h2>{{ t('apropos.expTitle') }}</h2>
                    <p class="text--experience" v-html="t('apropos.expText')"></p>
                </div>
                <a class="button-cv button--antiman button--round-l button--text-medium" :download="t('apropos.cvFileName')" :href="t('apropos.cvFile')">
                    <i class="button__icon icon icon-map-marker"></i><span>{{ t('apropos.cvButton') }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { t } = usePortfolioI18n();
</script>

<style lang="scss" scoped>
    #decouvrir{
        position: relative;
        top: -100px;
    }
    .section--apropos{
        display: flex;
        scroll-margin-top:500px;
        flex-direction: column;
        width: 100%;
        z-index: 10;
        margin-top: 100px;
        margin-bottom:200px;
        .container--apropos{
            display: flex;
            flex-direction: row;
            justify-content: center;
            .container--image{
                display: flex;
                justify-content: center;
                flex:1;
                .image--apropos{
                    object-position: left;
                    width: 500px;
                    object-fit: cover;
                    border-radius: 20px;
                    max-height: 700px;
                }
            }
            .container--text--apropos{
                display: flex;
                flex-direction: column;
                align-items: start;
                width: 40%;
                flex:1;
                gap: 30px;
                .text--metier, .text--experience{
                    display: flex;
                    flex-direction: column;
                    a{
                        display: contents;
                    }
                    gap: 10px;
                    h2{
                        font-size: 35px;
                    }
                    p{
                        font-size: 17px;
                        font-weight: 300;
                    }
                }
                a::before{
                    border-color: black;
                }
            }
        }
    }
@media screen and (max-width:1200px){
    .image--apropos{
        width: 400px!important;
    }
}

@media screen and (max-width:950px){
    .container--apropos{
        flex-direction: column!important;
        gap: 30px;
    }
    .container--text--apropos{
        width: 90%!important;
        align-self: center;
    }
    .image--apropos{
        max-height: 350px!important;
    }
}
</style>
