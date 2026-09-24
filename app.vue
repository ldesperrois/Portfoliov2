<template>
  <div id="app">
    <div id="content">
      <Header/>
      <NuxtPage/>
      <Footer/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '#app';
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { locale, t } = usePortfolioI18n();

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  title: computed(() => t('meta.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('meta.description'))
    }
  ]
});
</script>

<style lang="scss">
  #app{
    min-height: 100%;
  }
  #content.active{
    filter: blur(20px);
    user-select: none;
    pointer-events: none;
    overflow: none;
  }
</style>
