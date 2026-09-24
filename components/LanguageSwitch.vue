<template>
    <div class="lang-switcher">
        <button 
            type="button"
            :class="['lang-btn', { active: isFr }]" 
            @click="changeLang('fr')"
            title="Version Française"
            aria-label="Passer en version française"
        >
            <svg class="flag-icon" viewBox="0 0 640 480" aria-hidden="true">
                <g fill-rule="evenodd" stroke-width="1pt">
                    <path fill="#00267f" d="M0 0h213.3v480H0z"/>
                    <path fill="#ffffff" d="M213.3 0h213.4v480H213.3z"/>
                    <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
                </g>
            </svg>
            <span class="lang-code">FR</span>
        </button>
        <button 
            type="button"
            :class="['lang-btn', { active: isEn }]" 
            @click="changeLang('en')"
            title="English Version"
            aria-label="Switch to English version"
        >
            <svg class="flag-icon" viewBox="0 0 640 480" aria-hidden="true">
                <path fill="#012169" d="M0 0h640v480H0z"/>
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 64V0h75z"/>
                <path fill="#C8102E" d="m424 288 216 159v33h-44L380 318zm-208-96L0 33V0h44l216 162zM640 0v3l-197 147 36 27L640 52zm-384 333L0 447v33h32l224-168z"/>
                <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/>
                <path fill="#C8102E" d="M267 0h106v480H267zM0 187h640v106H0z"/>
            </svg>
            <span class="lang-code">EN</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';
import type { Locale } from '~/src/translations';

const emit = defineEmits(['change']);
const { isFr, isEn, setLocale } = usePortfolioI18n();

const changeLang = (lang: Locale) => {
    setLocale(lang);
    emit('change', lang);
};
</script>

<style lang="scss" scoped>
    .lang-switcher {
        display: inline-flex;
        align-items: center;
        background: #f1f3f5;
        padding: 3px 4px;
        border-radius: 20px;
        border: 1px solid rgba(50, 42, 100, 0.15);
        gap: 4px;
        
        .lang-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: none;
            padding: 4px 9px;
            border-radius: 16px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            color: #6c757d;
            cursor: pointer;
            transition: all 0.25s ease;

            .flag-icon {
                width: 20px;
                height: 14px;
                border-radius: 2px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
                display: block;
                flex-shrink: 0;
            }

            .lang-code {
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            &:hover {
                color: #322A64;
                background-color: rgba(50, 42, 100, 0.08);
            }

            &.active {
                background-color: #322A64;
                color: #ffffff;
                font-weight: 600;
                box-shadow: 0 2px 6px rgba(50, 42, 100, 0.25);

                .flag-icon {
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                }
            }
        }
    }
</style>
