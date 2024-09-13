<template>
    <div class="section--accueil" id="accueil">
        <div>
            <div class="cube"></div>
            <div class="cube"></div>
            <div class="cube"></div>
            <div class="cube"></div>
            <div class="cube"></div>
            <div class="cube"></div>
            <div class="cube"></div>
        </div>
        <div class="container--accueil">
            <div class="accueil--text">
                <h1>Portfolio<br/>Desperrois Lucas</h1>
                <p>Découvrez mes projets et compétences<br/> dans le domaine du développement web moderne</p>
                <div class="container--discover">
                    <NuxtLink class="discover" to="#decouvrir">Découvrir</NuxtLink>
                    <div class="reseaux">
                        <NuxtLink to="https://www.instagram.com/lucas.dsp/">
                            <font-awesome class="socialnetwork" :icon="['fab', 'instagram']" />
                        </NuxtLink>
                        <NuxtLink to="https://www.linkedin.com/in/lucas-desperrois-a453ba262/">
                            <font-awesome class="socialnetwork" :icon="['fab', 'linkedin']" />
                        </NuxtLink>
                        <NuxtLink to="https://github.com/ldesperrois" class="link-networks">
                            <font-awesome class="socialnetwork" :icon="['fab', 'github']" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <NuxtImg  src="/img/Peinture_abstraite_bleue.webp" class="accueil--img"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .section--accueil{
        padding-left: 4rem;
        padding-right: 4rem;       
        overflow: hidden;
        min-height: 100vh;
        display: flex;
        position: fixed;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #322A64;
        animation: gradient 10s ease infinite; 
        background-size: 400% 400%;
        
        }
        .container--accueil{
            display: flex;
            flex-direction: row;
            align-items: center;
            z-index: 1;
            
            gap: 100px;
            .accueil--img{
                object-fit: cover;
                min-height: 650px;
                border-radius: 20px;
                width: 450px;
            }
            .accueil--text{
                height: 100%;
                display: flex;
                gap: 30px;
                flex-direction: column;
                align-items: flex-start;
                color: #fff;
                
                h1{
                    font-size: 80px;
                    white-space:nowrap;
                    font-weight: 500;
                    
                }
                p{
                    font-size: 20px;
                    font-weight: 200;
                }
                .container--discover{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 30px;
                    a.discover{
                      cursor: pointer;
                        font-weight: 300;
                        color: #fff;
                        width: 150px;
                        height: 45px;
                        text-align: center;
                        display: flex;
                        border-radius: 20px;
                        align-items: center;
                        justify-content: center;
                        background-color: #1874B6;
                    }
                    div.reseaux{
                        display: flex;
                        flex-direction: row;
                        gap: 30px;
                        .socialnetwork{
                        font-size: 40px;
                        color:#fff;
                        }
                    }
                    
                }
            }
        }


    

    
@media  screen and (max-width:1250px) {
    .section--accueil{
        padding-right:2em;
        padding-left:2em;
        .container--accueil{
            gap: 50px;
            .accueil--img{
                width: 350px;
            }
            
        }
    }
}

@media screen and (max-width:1100px) {
    .section--accueil{
        padding-right: 1em;
        padding-left: 1em;
        .container--accueil{
            .accueil--text{
                h1{
                    font-size: 70px;
                }
                p{
                    font-size: 18px;
                }
            }
        }
    }
    h1{
        font-size: 65px;
    }
@media  screen and (max-width:1024px) {
    .accueil--img{
        display: none;
    }
    .section--accueil{
        padding-right: 1em;
        padding-left: 1em;
        .container--accueil{
            .accueil--text{
                align-items: center;
                h1{
                    font-size: 80px;
                    text-align: center;
                }
                p{
                    text-align: center;
                    font-size: 25px;
                }
                .container--discover{
                    a.discover{
                        font-size: 20px;
                        height: 60px;
                        width: 170px;

                    }
                }
            }

    }
    }
}

@media  screen and (max-width:768px) {
    h1{
        font-size: 70px !important;
    }
    p{
        font-size: 20px !important;
    }
}

@media screen and (max-width:600px) {
    h1{
        text-wrap: wrap !important;
    }
    .container--discover{
        flex-direction: column !important;
    }
}
@media screen and (max-width:400px) {
    h1{
        font-size: 60px!important;
    }
}
}
</style>
