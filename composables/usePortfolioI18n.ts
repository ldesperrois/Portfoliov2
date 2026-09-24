import { computed, watch } from 'vue';
import { useRoute, useRouter, useState } from '#app';
import { translations, type Locale } from '~/src/translations';

export const usePortfolioI18n = () => {
  const route = useRoute();
  const router = useRouter();

  // Reactive state for locale, initialized based on current path
  const locale = useState<Locale>('portfolio_locale', () => {
    return route.path.startsWith('/en') ? 'en' : 'fr';
  });

  // Sync locale whenever route changes
  watch(
    () => route.path,
    (newPath) => {
      const detectedLocale: Locale = newPath.startsWith('/en') ? 'en' : 'fr';
      if (locale.value !== detectedLocale) {
        locale.value = detectedLocale;
      }
    },
    { immediate: true }
  );

  const isEn = computed(() => locale.value === 'en');
  const isFr = computed(() => locale.value === 'fr');

  /**
   * Helper to retrieve nested translation keys, e.g. t('nav.accueil')
   */
  const t = (path: string): string => {
    const keys = path.split('.');
    const currentLangDict = translations[locale.value] as any;
    const fallbackDict = translations.fr as any;

    let res = currentLangDict;
    for (const key of keys) {
      if (res && res[key] !== undefined) {
        res = res[key];
      } else {
        res = undefined;
        break;
      }
    }

    if (res !== undefined) return String(res);

    // Fallback to French
    let fallback = fallbackDict;
    for (const key of keys) {
      if (fallback && fallback[key] !== undefined) {
        fallback = fallback[key];
      } else {
        return path;
      }
    }
    return String(fallback);
  };

  /**
   * Generates localized anchor or path
   */
  const localePath = (target: string): string => {
    const cleanTarget = target.startsWith('/') ? target : `/${target}`;
    if (isEn.value) {
      if (cleanTarget.startsWith('/#')) {
        return `/en${cleanTarget.slice(1)}`;
      }
      if (cleanTarget === '/') return '/en';
      return cleanTarget.startsWith('/en') ? cleanTarget : `/en${cleanTarget}`;
    } else {
      if (cleanTarget.startsWith('/en#')) {
        return cleanTarget.replace('/en#', '/#');
      }
      if (cleanTarget === '/en') return '/';
      return cleanTarget.replace(/^\/en/, '') || '/';
    }
  };

  /**
   * Switch language and navigate accordingly
   */
  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale;
    const currentHash = route.hash || '';
    if (newLocale === 'en') {
      router.push(`/en${currentHash}`);
    } else {
      router.push(`/${currentHash}`);
    }
  };

  const toggleLocale = () => {
    setLocale(locale.value === 'fr' ? 'en' : 'fr');
  };

  return {
    locale,
    isEn,
    isFr,
    t,
    localePath,
    setLocale,
    toggleLocale,
  };
};
