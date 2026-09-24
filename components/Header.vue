<template>
    <header class="header">
        <NuxtLink :to="isEn ? '/en' : '/'">
            <NuxtImg class="header--img" src="/img/Sublimateur_Pixelcut_Export.webp" height="73" alt="Logo Lucas Desperrois"/>
        </NuxtLink>

        <div class="header--menu">
            <div class="menu--link">
                <NuxtLink :to="localePath('#accueil')" @click="closeMenu">{{ t('nav.accueil') }}</NuxtLink>
                <div class="surligne"></div>
            </div>
            <div class="menu--link">
                <NuxtLink :to="localePath('#decouvrir')" @click="closeMenu">{{ t('nav.apropos') }}</NuxtLink>
                <div class="surligne"></div>
            </div>
            <div class="menu--link">
                <NuxtLink :to="localePath('#anchor-programming')" @click="closeMenu">{{ t('nav.outils') }}</NuxtLink>
                <div class="surligne"></div>
            </div>
            <div class="menu--link">
                <NuxtLink :to="localePath('#projet')" @click="closeMenu">{{ t('nav.projets') }}</NuxtLink>
                <div class="surligne"></div>
            </div>
            <div class="menu--link">
                <NuxtLink :to="localePath('#parcours')" @click="closeMenu">{{ t('nav.parcours') }}</NuxtLink>
                <div class="surligne"></div>
            </div>
            <div class="menu--link">
                <NuxtLink :to="localePath('#contact')" @click="closeMenu">{{ t('nav.contact') }}</NuxtLink>
                <div class="surligne"></div>
            </div>
            <div class="menu--link menu--link--lang desktop-only">
                <div class="lang-switcher">
                    <button 
                        type="button"
                        :class="['lang-btn', { active: isFr }]" 
                        @click="changeLang('fr')"
                        aria-label="Passer en version française"
                    >
                        FR
                    </button>
                    <button 
                        type="button"
                        :class="['lang-btn', { active: isEn }]" 
                        @click="changeLang('en')"
                        aria-label="Switch to English version"
                    >
                        EN
                    </button>
                </div>
            </div>
        </div>

        <div class="header--actions-mobile">
            <div class="lang-switcher mobile-only">
                <button 
                    type="button"
                    :class="['lang-btn', { active: isFr }]" 
                    @click="changeLang('fr')"
                    aria-label="Passer en version française"
                >
                    FR
                </button>
                <button 
                    type="button"
                    :class="['lang-btn', { active: isEn }]" 
                    @click="changeLang('en')"
                    aria-label="Switch to English version"
                >
                    EN
                </button>
            </div>
            <div class="menu--hamburger" @click="menu">
                <font-awesome class="hamburger" :icon="icon" />
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';
import type { Locale } from '~/src/translations';

export default defineComponent({
    name: 'Header',
    setup() {
        const { t, locale, isEn, isFr, setLocale, localePath } = usePortfolioI18n();
        const iconChange = ref(false);

        const icon = computed(() => {
            return iconChange.value ? 'close' : 'bars';
        });

        const menu = () => {
            iconChange.value = !iconChange.value;
            const phoneMenu = document.querySelector('.header--menu');
            if (phoneMenu) {
                phoneMenu.classList.toggle('active');
            }
        };

        const closeMenu = () => {
            iconChange.value = false;
            const phoneMenu = document.querySelector('.header--menu');
            if (phoneMenu) {
                phoneMenu.classList.remove('active');
            }
        };

        const changeLang = (lang: Locale) => {
            setLocale(lang);
            closeMenu();
        };

        return {
            t,
            locale,
            isEn,
            isFr,
            localePath,
            icon,
            iconChange,
            menu,
            closeMenu,
            changeLang,
        };
    },
});
</script>

<style lang="scss" scoped>
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        z-index: 99;
        min-height: 90px;
        align-items: center;
        position: sticky;
        background-color: #fff;
        top: 0;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        
        img {
            margin-left: 10px;
        }

        .header--menu {
            display: flex;
            flex-direction: row;
            gap: 25px;
            align-items: center;
            font-size: 20px;
            margin-right: 2em;

            .menu--link {
                .surligne {
                    width: 0%;
                    margin-top: 1px;
                    background-color: rgb(30, 28, 28);
                    height: 3px;
                    transition: all .4s;
                }
                a:hover + .surligne {
                    width: 100%;
                }
                a:hover {
                    cursor: pointer;
                }
                a {
                    color: black;
                    font-weight: 300;
                    text-decoration: none;
                }
            }

            .menu--link--lang {
                margin-left: 10px;
            }
        }

        .header--actions-mobile {
            display: none;
            align-items: center;
            gap: 15px;
            margin-right: 20px;
        }

        .menu--hamburger {
            cursor: pointer;
            font-size: 32px;
            display: flex;
            align-items: center;
        }
    }

    .lang-switcher {
        display: inline-flex;
        align-items: center;
        background: #f1f3f5;
        padding: 3px 4px;
        border-radius: 20px;
        border: 1px solid rgba(50, 42, 100, 0.15);
        gap: 2px;
        
        .lang-btn {
            background: transparent;
            border: none;
            padding: 4px 10px;
            border-radius: 16px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            color: #6c757d;
            cursor: pointer;
            transition: all 0.25s ease;

            &:hover {
                color: #322A64;
            }

            &.active {
                background-color: #322A64;
                color: #ffffff;
                font-weight: 600;
                box-shadow: 0 2px 6px rgba(50, 42, 100, 0.25);
            }
        }
    }

    .desktop-only {
        display: block;
    }

    .mobile-only {
        display: none;
    }

    @media screen and (max-width: 900px) {
        .desktop-only {
            display: none !important;
        }
        .mobile-only {
            display: inline-flex !important;
        }
        .header--actions-mobile {
            display: flex !important;
        }
        .header--menu {
            position: absolute !important;
            top: 88px;
            gap: 0 !important;
            margin: 0;
            flex-direction: column !important;
            width: 100%;
            height: fit-content;
            justify-content: center;
            background-color: #fff;
            opacity: 0;
            transition: opacity 0.3s ease;
            visibility: hidden;
            
            .menu--link {
                border-bottom: dashed 1px #ddd;
                width: 80%;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
                div.surligne {
                    display: none;
                }
            }
        }
        
        .header--menu.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transition: opacity 0.3s ease;

            .menu--link {
                &:last-child {
                    border-bottom: 0;
                }
            }
        }
    }
</style>