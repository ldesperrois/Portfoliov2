<template>
    <div class="section--accueil" id="accueil">
        <EffectCircuitSchematic />
        
        <div class="container--accueil">
            <div class="accueil--text">
                <h1 class="hero-name">Lucas Desperrois</h1>
                
                <p v-html="t('accueil.subtitle')"></p>
                
                <div class="container--discover">
                    <a :href="localePath('#decouvrir')" class="button-cv button--antiman button--round-l button--text-medium button-discover">
                        <i class="button__icon icon icon-map-marker"></i><span>{{ t('accueil.discover') }}</span>
                    </a>
                    <div class="reseaux">
                        <NuxtLink to="https://www.instagram.com/lucas.dsp/" aria-label="Instagram">
                            <font-awesome class="socialnetwork" :icon="['fab', 'instagram']" />
                        </NuxtLink>
                        <NuxtLink to="https://www.linkedin.com/in/lucas-desperrois-a453ba262/" aria-label="LinkedIn">
                            <font-awesome class="socialnetwork" :icon="['fab', 'linkedin']" />
                        </NuxtLink>
                        <NuxtLink to="https://github.com/ldesperrois" class="link-networks" aria-label="GitHub">
                            <font-awesome class="socialnetwork" :icon="['fab', 'github']" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <a :href="localePath('#decouvrir')" class="scroll-indicator" aria-label="Scroll down">
            <div class="chevrons-stack">
                <svg class="chevron chevron-1" width="20" height="9" viewBox="0 0 20 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 2L10 7L18 2"/>
                </svg>
                <svg class="chevron chevron-2" width="20" height="9" viewBox="0 0 20 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 2L10 7L18 2"/>
                </svg>
                <svg class="chevron chevron-3" width="20" height="9" viewBox="0 0 20 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 2L10 7L18 2"/>
                </svg>
            </div>
            <span class="scroll-label">{{ t('accueil.scrollDown') }}</span>
        </a>
    </div>
</template>

<script setup lang="ts">
import { usePortfolioI18n } from '~/composables/usePortfolioI18n';

const { t, localePath } = usePortfolioI18n();
</script>

<style lang="scss" scoped>
    .section--accueil{
        padding-left: 4rem;
        padding-right: 4rem;  
        margin-bottom: 100px;
        overflow: hidden;
        min-height: 100vh;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #060919;
    }

    .container--accueil{
        display: flex;
        flex-direction: row;
        align-items: center;
        z-index: 2;
        gap: 100px;
        max-width: 1200px;
        width: 100%;

        .accueil--text{
            height: 100%;
            display: flex;
            gap: 24px;
            flex-direction: column;
            align-items: flex-start;
            color: #FFFF;
            
            h1.hero-name{
                font-size: 90px;
                white-space: nowrap;
                font-weight: 700;
                letter-spacing: -0.025em;
                line-height: 1.05;
                color: #ffffff;
                text-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
            }

            p{
                font-size: 23px;
                font-weight: 300;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.88);
            }

            .container--discover{
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 30px;
                margin-top: 10px;

                .button-discover {
                    background: #ffffff;
                    color: #0b1026 !important;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(255, 255, 255, 0.35);
                    }
                }

                div.reseaux{
                    display: flex;
                    flex-direction: row;
                    gap: 25px;

                    .socialnetwork{
                        font-size: 45px;
                        color: rgba(255, 255, 255, 0.85);
                        transition: color 0.25s ease, transform 0.25s ease;

                        &:hover {
                            color: #64b5f6;
                            transform: translateY(-3px);
                        }
                    }
                }
            }
        }
    }

    .scroll-indicator {
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        z-index: 2;
        transition: color 0.3s ease, transform 0.3s ease;

        &:hover {
            color: #38bdf8;
            transform: translateX(-50%) translateY(-2px);
        }

        .chevrons-stack {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            margin-bottom: 2px;

            .chevron {
                color: #38bdf8;
                animation: chevron-cascade 1.6s ease-in-out infinite;

                &.chevron-1 { animation-delay: 0s; }
                &.chevron-2 { animation-delay: 0.22s; }
                &.chevron-3 { animation-delay: 0.44s; }
            }
        }

        .scroll-label {
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
    }

    @keyframes chevron-cascade {
        0% { opacity: 0.15; transform: translateY(-2px); }
        50% { opacity: 1; transform: translateY(0); color: #00f0ff; }
        100% { opacity: 0.15; transform: translateY(2px); }
    }

    @media screen and (max-width:1250px) {
        .section--accueil{
            padding-right: 2em;
            padding-left: 2em;
            .container--accueil{
                gap: 50px;
            }
        }
    }

    @media screen and (max-width:1100px) {
        .section--accueil{
            padding-right: 1.5em;
            padding-left: 1.5em;
            .container--accueil{
                .accueil--text{
                    h1.hero-name{
                        font-size: 70px;
                    }
                    p{
                        font-size: 20px;
                    }
                }
            }
        }
    }

    @media screen and (max-width:1024px) {
        .section--accueil{
            padding-right: 1.5em;
            padding-left: 1.5em;
            .container--accueil{
                .accueil--text{
                    align-items: center;
                    text-align: center;
                    
                    h1.hero-name{
                        font-size: 65px;
                        text-align: center;
                        white-space: normal;
                    }
                    p{
                        text-align: center;
                        font-size: 20px;
                    }
                    .status-badge {
                        font-size: 13px;
                        padding: 6px 14px;
                    }
                }
            }
        }
    }

    @media screen and (max-width:768px) {
        .accueil--text h1.hero-name{
            font-size: 52px !important;
        }
        .accueil--text p{
            font-size: 17px !important;
        }
        .scroll-indicator {
            display: none;
        }
    }

    @media screen and (max-width:600px) {
        .container--discover{
            flex-direction: column !important;
            gap: 20px !important;
        }
        .accueil--text h1.hero-name{
            font-size: 42px !important;
        }
    }
</style>
