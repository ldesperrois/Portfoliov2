<template>
    <div class="section--projets" >
        <div id="projet" class="anchor-projets"></div>
        <EffectTypingText :key="'typing-' + locale" :text="sectionTitle"/>
        <SliderProjets :key="'slider-' + locale" :datas="currentProjets" :perView="2"/>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getProjets } from '~/src/projets';
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { t, locale } = usePortfolioI18n();

const sectionTitle = computed(() => {
    return t('projets.title');
});

const currentProjets = computed(() => {
    return getProjets(locale.value);
});
</script>

<style lang="scss">
    .section--projets{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: 5em; 
        gap: 70px;
        margin-bottom: 100px;
        margin-top: 100px;
    }
    .anchor-projets{
        position: relative;
        top: -100px;
    }
</style>