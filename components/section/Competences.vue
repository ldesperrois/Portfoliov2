<template>
    <section id="competences">
        <h1>{{ t('competences.title') }}</h1>
        <div class="container-competences">
            <CardCompetences v-for="competence in currentCompetences" :key="competence.id + '-' + locale" :compt="competence"/>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCompetences } from '~/src/competences';
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { t, locale } = usePortfolioI18n();

const currentCompetences = computed(() => {
    return getCompetences(locale.value);
});
</script>

<style lang="scss" scoped>
    #competences{
        width: 100%;
        margin-top: 150px;
        margin-bottom: 150px;
        h1{
            font-size: 35px;
            text-align: center;
        }
        .container-competences {
            align-content: center;
            margin-top: 100px;
            display: grid;
            place-items: center;
            gap: 30px;
            grid-template-columns: repeat(3, 1fr); /* 3 colonnes par défaut */

            @media (max-width: 1024px) {
              grid-template-columns: repeat(2, 1fr); /* 2 colonnes en écran tablette */
            }

            @media (max-width: 480px) {
              grid-template-columns: 1fr; /* 1 colonne sur écran mobile */
            }
        }
    }
</style>
