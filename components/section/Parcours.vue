<template>
    <div class="section--parcours" id="parcours">
        <h1>{{ t('parcours.title') }}</h1>
        <div>
            <div class="timeline">
                <Event v-for="parcour in currentParcours" :key="parcour.id + '-' + locale" :parcour="parcour"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getParcours } from '~/src/parcours';
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { t, locale } = usePortfolioI18n();

const currentParcours = computed(() => {
    return getParcours(locale.value);
});
</script>

<style lang="scss">
    .section--parcours{
        display: flex;
        flex-direction: column;
        background-color:#322A64;
        padding-left: 3em;
        padding-right: 3em;
        margin-top: 150px;
        align-items: center;
        h1{
            font-size: 35px;
            color : #fff;
            margin-top: 2em;
            text-align: center;
        }
        h1+div{
            margin-bottom: 100px;
            margin-top: 50px;
        }
        .timeline{
            margin-top: 2em;
            margin-bottom: 2em;
            display: flex;
            flex-direction: column;
            margin-left: 200px;
            position: relative;
            border-left: 4px solid #fff;
            .event:first-child{
                margin-top: 50px;
            }
            .event:last-child{
                margin-bottom: 10px;
            }
        }
    }
    @media screen and (max-width:1200px) {
      .section--parcours{
        padding-left: 1em;
        padding-right: 1em;
      }
      h1{
        align-self: center;
      }
    }
    @media screen and (max-width:768px) {
        .timeline{
            margin-left: 100px!important;
        }
    }
</style>