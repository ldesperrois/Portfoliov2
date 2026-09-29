<template>
    <main>
        <sectionAccueil/>
        <div class="container--propos--projets">
            <sectionApropos/>
            <div class="bar"></div>
            <sectionCompetences/>
            <div class="bar"></div>
            <sectionProgrammingLanguage/>
            <div class="bar"></div>
            <sectionProjets/>           
            <div class="bar"></div>
        </div>
        <SectionParcours/>
    </main>
</template>

<script setup lang="ts">
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { locale } = usePortfolioI18n();
</script>

<style lang="scss">
    html{
        overflow: scroll;
    }
    .bar{
        height: 6px;
        width: 400px;
        background-color: #322A64;
        align-self: center;
    }
    main{
        display: flex;
        flex-direction: column;
        background-color: #ECEFF1;
        .container--propos--projets{
            display: flex;
            flex-direction: column;
            padding-left: 3em;
            padding-right: 3em;
        }
    }

    @media screen and (max-width:1200px) {
        .container--propos--projets{
            padding-right: 1em!important;
            padding-left: 1em !important;
        }
    }

    @media  screen and (max-width:768px) {
        .bar{
            width: 250px;
        }
    }
</style>
