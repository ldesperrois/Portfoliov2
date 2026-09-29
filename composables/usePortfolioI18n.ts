import { computed, watch } from 'vue';
import { useRoute, useRouter, useState } from '#app';
import { translations, type Locale } from '~/src/translations';

export const usePortfolioI18n = () => {
  const route = useRoute();
  const router = useRouter();

  // Reactive state for locale, initialized based on current URL path
  const locale = useState<Locale>('portfolio_locale', () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/en') ? 'en' : 'fr';
    }
    return route.path.startsWith('/en') ? 'en' : 'fr';
  });

  // Ensure client locale strictly matches the actual browser URL on initial load / refresh
  if (typeof window !== 'undefined' && !(window as any).__portfolio_initial_synced) {
    (window as any).__portfolio_initial_synced = true;
    const isEnPath = window.location.pathname.startsWith('/en');
    const expectedLocale: Locale = isEnPath ? 'en' : 'fr';
    if (locale.value !== expectedLocale) {
      locale.value = expectedLocale;
    }
  }

  // Keep locale in sync with browser back / forward buttons (popstate)
  if (typeof window !== 'undefined' && !(window as any).__portfolio_popstate_bound) {
    (window as any).__portfolio_popstate_bound = true;
    window.addEventListener('popstate', () => {
      const isEnPath = window.location.pathname.startsWith('/en');
      const targetLocale: Locale = isEnPath ? 'en' : 'fr';
      if (locale.value !== targetLocale) {
        locale.value = targetLocale;
      }
    });
  }

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
   * Switch language instantly and update browser address bar without freezing or unmounting the page
   */
  const setLocale = (newLocale: Locale) => {
    if (locale.value === newLocale) return;
    locale.value = newLocale;

    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash || '';
      const target = newLocale === 'en' ? `/en${currentHash}` : `/${currentHash}`;
      try {
        window.history.pushState(window.history.state, '', target);
      } catch (e) {
        // Fallback if pushState is restricted
      }
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
